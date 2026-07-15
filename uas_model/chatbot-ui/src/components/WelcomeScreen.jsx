const SUGGESTIONS = [
  "Apa itu AI?",
  "Bantu coding Python",
  "Jelaskan neural network",
  "Buatkan website simple",
];

export default function WelcomeScreen({ onSuggestion, inputRef }) {
  return (
    <div className="text-center space-y-5 max-w-md animate-fade-in">
      <div className="flex items-center gap-3.5 justify-center">
        <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="Coders Minix" className="w-7 h-7 object-contain" />
        </div>
        <div className="text-left">
          <h1 className="text-base font-semibold text-stone-200 tracking-tight">
            Coders Minix
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            Chatbot AI untuk coding dan pengetahuan umum
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => {
              onSuggestion(text);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="text-xs text-stone-400 bg-stone-900 hover:bg-stone-800 hover:text-stone-200 border border-stone-800 rounded-full px-3.5 py-1.5 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
