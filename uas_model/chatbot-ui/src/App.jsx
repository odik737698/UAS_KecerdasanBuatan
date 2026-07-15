import { useState, useRef, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import useLocalStorage from "./hooks/useLocalStorage";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import SettingsModal from "./components/SettingsModal";
import { GridScan } from "./components/GridScan";
import Presentation from "./components/Presentation";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

function sanitizeContent(text) {
  return text.replace(/<\|im_end\|>/g, "").replace(/<\|im_start\|>/g, "").trim();
}

function generateTitle(text) {
  const clean = text.replace(/[\n\r]+/g, " ").trim();
  return clean.length > 40 ? clean.slice(0, 40) + "..." : clean || "Percakapan baru";
}

export default function App() {
  const [conversations, setConversations] = useLocalStorage("chatbot-conversations", []);
  const [activeConvId, setActiveConvId] = useLocalStorage("chatbot-active-conv", null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gridScanEnabled, setGridScanEnabled] = useLocalStorage("chatbot-gridscan", true);
  const [accentColor, setAccentColor] = useLocalStorage("chatbot-accent", "#ff8c00");
  const [page, setPage] = useState("landing");
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConvId) || null;
  const hasHistory = activeConversation ? activeConversation.messages.length > 0 : false;
  const isStreaming = streamingContent !== null;
  const isExpanded = hasHistory || inputFocused;
  const messages = activeConversation ? activeConversation.messages : [];

  useEffect(() => {
    const old = localStorage.getItem("chatbot-messages");
    if (old && conversations.length === 0) {
      try {
        const msgs = JSON.parse(old);
        if (Array.isArray(msgs) && msgs.length > 0) {
          const firstMsg = msgs.find(m => m.role === "user");
          const newConv = {
            id: nanoid(),
            title: firstMsg ? generateTitle(firstMsg.content) : "Percakapan 1",
            messages: msgs,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setConversations([newConv]);
          setActiveConvId(newConv.id);
        }
      } catch {}
      localStorage.removeItem("chatbot-messages");
    }
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function updateConversation(convId, updater) {
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...updater(c), updatedAt: Date.now() } : c
    ));
  }

  function saveMessages(convId, newMessages) {
    updateConversation(convId, c => ({ ...c, messages: newMessages }));
  }

  function addMessageToConv(convId, msg) {
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c
    ));
  }

  function createNewConversation(title) {
    const newConv = {
      id: nanoid(),
      title: title || "Percakapan baru",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    return newConv.id;
  }

  const sendMessage = useCallback(async () => {
    const userText = input.trim();
    if (!userText || loading) return;

    const userMsg = {
      id: nanoid(),
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    let currentConvId = activeConvId;
    let currentMessages = messages;

    if (!currentConvId) {
      currentConvId = createNewConversation(generateTitle(userText));
      currentMessages = [];
      saveMessages(currentConvId, [userMsg]);
    } else {
      const updated = [...currentMessages, userMsg];
      saveMessages(currentConvId, updated);
      currentMessages = updated;
    }

    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const convIdSnapshot = currentConvId;

    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: currentMessages.map(({ id, timestamp, ...rest }) => rest),
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Stream not available");

      setStreamingContent("");

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.token) {
              fullContent += parsed.token;
              setStreamingContent(sanitizeContent(fullContent));
            }
          } catch {}
        }
      }

      addMessageToConv(convIdSnapshot, {
        id: nanoid(),
        role: "assistant",
        content: sanitizeContent(fullContent),
        timestamp: Date.now(),
      });
      setStreamingContent(null);
    } catch (error) {
      if (error.name === "AbortError") return;
      setStreamingContent(null);

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: currentMessages.map(({ id, timestamp, ...rest }) => rest),
          }),
        });

        const data = await response.json();
        addMessageToConv(convIdSnapshot, {
          id: nanoid(),
          role: "assistant",
          content: sanitizeContent(data.reply),
          timestamp: Date.now(),
        });
      } catch {
        addMessageToConv(convIdSnapshot, {
          id: nanoid(),
          role: "assistant",
          content: "Gagal nyambung ke server bg",
          timestamp: Date.now(),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, activeConvId]);

  function handleNewChat() {
    setInputFocused(false);
    createNewConversation("Percakapan baru");
    setSidebarOpen(false);
  }

  function handleSelectConversation(id) {
    setActiveConvId(id);
    setInputFocused(true);
    setSidebarOpen(false);
  }

  function handleDeleteConversation(id) {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        setActiveConvId(null);
        setInputFocused(false);
      }
    }
  }

  function handleRenameConversation(id, title) {
    updateConversation(id, c => ({ ...c, title }));
  }

  function handleSuggestion(text) {
    setInput(text);
    setInputFocused(true);
    inputRef.current?.focus();
  }

  function handleInputFocus() {
    setInputFocused(true);
  }

  function handleInputBlur() {
    setInputFocused(false);
  }

  function handleExport() {
    const data = JSON.stringify(conversations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chatbot-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error("Format tidak valid");
        setConversations(prev => [...imported, ...prev]);
        toast.success(`Berhasil import ${imported.length} percakapan`);
      } catch {
        toast.error("File JSON tidak valid");
      }
    };
    reader.readAsText(file);
  }

  function handleStopGeneration() {
    abortRef.current?.abort();
  }

  function handleToggleGridScan() {
    setGridScanEnabled(prev => !prev);
  }

  function handleChangeAccent(color) {
    setAccentColor(color);
  }

  if (page === "landing") {
    return (
      <>
        <TooltipProvider>
          <Presentation onStart={() => setPage("chat")} />
        </TooltipProvider>
        <Toaster />
      </>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-dvh bg-stone-950 text-stone-200 flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
        onExport={handleExport}
        onImport={handleImport}
        onSettings={() => setSettingsOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GridScan
            key={accentColor}
            active={gridScanEnabled && inputFocused}
            linesColor="#0a0908"
            scanColor={accentColor}
            scanOpacity={0.4}
            gridScale={0.1}
            lineThickness={1.5}
            lineJitter={0.05}
            scanDuration={1.4}
            scanDelay={9999}
            scanDirection="forward"
            scanSoftness={2.5}
            scanGlow={0.35}
            noiseIntensity={0.001}
            chromaticAberration={0.002}
            enablePost
            bloomIntensity={0.3}
            bloomThreshold={0.1}
            bloomSmoothing={0.1}
          />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-4">
          <div className={`w-full max-w-2xl bg-stone-950 border border-stone-900 rounded-2xl flex flex-col overflow-hidden transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(251,146,60,0.25)] card-texture ${
            isExpanded
              ? "max-h-[1100px] py-10 sm:py-12"
              : "max-h-[620px] sm:max-h-[660px] py-0"
          }`}>
            {/* Header area */}
            <div className="shrink-0 flex items-center gap-2 px-5 pt-3">
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
                title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
              >
                {sidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
              <div className="flex-1" />
              {hasHistory && conversations.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="text-xs text-stone-600 hover:text-stone-400 transition-colors px-2 py-1 rounded-md hover:bg-stone-800"
                >
                  Percakapan baru
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 flex-1 flex flex-col">
                  <ChatArea
                    messages={messages}
                    loading={loading}
                    streamingContent={streamingContent}
                    onSuggestion={handleSuggestion}
                    inputRef={inputRef}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 max-w-2xl mx-auto w-full px-4 sm:px-6 pb-4">
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={sendMessage}
                onStop={handleStopGeneration}
                loading={loading}
                isStreaming={isStreaming}
                inputRef={inputRef}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        gridScanEnabled={gridScanEnabled}
        onToggleGridScan={handleToggleGridScan}
        accentColor={accentColor}
        onChangeAccent={handleChangeAccent}
      />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
