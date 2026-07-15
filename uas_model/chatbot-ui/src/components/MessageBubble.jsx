import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CopyButton from "./CopyButton";

function formatTime(ts) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

export default function MessageBubble({ message, isStreaming, index }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} message-enter`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`group relative ${
          isUser
            ? "bg-stone-800 text-stone-200 rounded-xl px-4 py-3 max-w-[80%]"
            : "text-stone-300 w-full max-w-[90%]"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap text-[14px] leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="markdown-body text-[14px] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        <div
          className={`flex items-center gap-2 ${
            isUser ? "justify-end" : "justify-start"
          } ${isUser ? "mt-1.5" : "mt-2"}`}
        >
          <span className="text-[10px] text-stone-600 tracking-tight">
            {formatTime(message.timestamp)}
          </span>
          {!isUser && <CopyButton text={message.content} />}
        </div>
      </div>
    </div>
  );
}
