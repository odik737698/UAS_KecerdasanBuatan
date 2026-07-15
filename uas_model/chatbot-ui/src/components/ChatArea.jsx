import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";

function getDateLabel(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hari Ini";
  if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

  const diffDays = Math.floor((today - date) / 86400000);
  if (diffDays < 7) return date.toLocaleDateString("id-ID", { weekday: "long" });

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function groupMessagesByDate(messages) {
  if (messages.length === 0) return [];
  const groups = [];
  let currentLabel = getDateLabel(messages[0].timestamp);
  let currentGroup = [];

  for (const msg of messages) {
    const label = getDateLabel(msg.timestamp);
    if (label !== currentLabel) {
      groups.push({ label: currentLabel, messages: currentGroup });
      currentLabel = label;
      currentGroup = [];
    }
    currentGroup.push(msg);
  }
  groups.push({ label: currentLabel, messages: currentGroup });
  return groups;
}

export default function ChatArea({
  messages,
  loading,
  streamingContent,
  onSuggestion,
  inputRef,
}) {
  const bottomRef = useRef(null);
  const hasHistory = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, loading]);

  if (!hasHistory && streamingContent === null && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <WelcomeScreen onSuggestion={onSuggestion} inputRef={inputRef} />
      </div>
    );
  }

  const grouped = groupMessagesByDate(messages);

  return (
    <>
      <div className="py-6 space-y-5">
        {grouped.map((group, gi) => (
          <div key={gi}>
            <div className="flex items-center gap-3 mb-4 mt-2 first:mt-0">
              <div className="flex-1 h-px bg-stone-800/60" />
              <span className="text-[11px] text-stone-600 font-medium shrink-0">{group.label}</span>
              <div className="flex-1 h-px bg-stone-800/60" />
            </div>
            {group.messages.map((message) => (
              <MessageBubble key={message.id} message={message} index={messages.indexOf(message)} />
            ))}
          </div>
        ))}

        {streamingContent !== null && (
          <MessageBubble
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingContent,
              timestamp: Date.now(),
            }}
            isStreaming
            index={messages.length}
          />
        )}

        {loading && streamingContent === null && <TypingIndicator />}
      </div>
      <div ref={bottomRef} />
    </>
  );
}
