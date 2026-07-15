import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Square, ArrowUp } from "lucide-react";

export default function ChatInput({ input, setInput, onSend, onStop, loading, isStreaming, inputRef, onFocus, onBlur }) {
  const textareaRef = useRef(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  useEffect(() => {
    autoResize();
  }, [input]);

  function handleInput(event) {
    setInput(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !loading) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className="flex items-end gap-2 bg-stone-900 rounded-xl px-4 py-3 border border-stone-800 focus-within:border-stone-600 transition-colors">
        <textarea
          ref={(el) => {
            textareaRef.current = el;
            if (typeof inputRef === "function") inputRef(el);
            else if (inputRef) inputRef.current = el;
          }}
          className="flex-1 bg-transparent text-stone-200 text-[14px] outline-none placeholder:text-stone-600 resize-none overflow-y-auto leading-[1.4] transition-[height] duration-200 ease-out"
          placeholder="Tulis pesan..."
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={loading}
          rows={1}
          style={{ minHeight: "20px", maxHeight: "160px" }}
        />
        {isStreaming ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onStop}
            className="shrink-0"
          >
            <Square className="size-3.5 fill-current" />
            Stop
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="shrink-0 bg-orange-600 hover:bg-orange-500 text-white disabled:bg-stone-800 disabled:text-stone-600"
          >
            <ArrowUp className="size-3.5" />
            Kirim
          </Button>
        )}
      </div>
    </div>
  );
}
