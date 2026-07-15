import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Shuffle from "@/components/Shuffle";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";

const MAX_SLIDE = 8;

function ArrowLeftIcon() {
  return <ChevronLeft className="size-5" />;
}

function ArrowRightIcon() {
  return <ChevronRight className="size-5" />;
}

function BarChart({ label, value, color = "bg-orange-500", delay = 0, ready, slow }) {
  return (
    <div className="mb-3 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-stone-400">{label}</span>
        <span className="text-stone-200 font-semibold">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className={`h-2.5 bg-stone-800 rounded-full ${slow ? "" : "overflow-hidden"}`}>
        <div
          className={`h-full ${color} rounded-full ${slow ? "animate-[bar-overflow_3s_ease-out]" : "transition-all duration-1000 ease-out"}`}
          style={{ width: ready ? (slow ? "150%" : `${value * 100}%`) : "0%" }}
        />
      </div>
    </div>
  );
}

function SlideCounter({ current, total, onDotClick }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`rounded-full transition-all duration-500 ease-out ${
            i === current
              ? "bg-orange-500 w-8 h-2"
              : "bg-stone-700 hover:bg-stone-500 w-2 h-2"
          }`}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

function SlideLabel({ current, total, onPrev, onNext }) {
  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-3 z-20">
      <span className="text-stone-600 text-sm font-mono tracking-wider">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onPrev}
          disabled={current === 0}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onNext}
          disabled={current === total - 1}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { name: "Java", r1: 0.109, r2: 0.049, rl: 0.101 },
  { name: "Coding", r1: 0.154, r2: 0.053, rl: 0.113 },
  { name: "GenAI", r1: 0.108, r2: 0.036, rl: 0.093 },
  { name: "MySQL", r1: 0.122, r2: 0.044, rl: 0.093 },
  { name: "Web", r1: 0.123, r2: 0.044, rl: 0.106 },
  { name: "Git", r1: 0.082, r2: 0.032, rl: 0.074 },
  { name: "Python", r1: 0.036, r2: 0.011, rl: 0.033 },
  { name: "Full", r1: 0.067, r2: 0.018, rl: 0.057 },
];

const PDFS = [
  "Buku Panduan GenAI untuk Mahasiswa",
  "Python for Everybody (pythonlearn)",
  "Pro Git (progit)",
  "MySQL Notes for Professionals",
  "Pemrograman Web Dasar",
  "Dasar-Dasar Coding",
  "Dasar-Dasar Pemrograman (Java)",
  "Pemrograman Komputer FULL",
];

const TOPICS = [
  { label: "Topik", value: "Java, Python, Git, MySQL, Web, AI, Coding" },
  { label: "Jumlah", value: "8 PDF" },
  { label: "Total Halaman", value: "~1,500+" },
  { label: "Bahasa", value: "Indonesia & Inggris" },
  { label: "Format", value: "PDF teks (non-OCR)" },
];

const CLEANING_STEPS = [
  { step: "01", title: "Ekstraksi PDF", desc: "Baca teks dari tiap file PDF dengan PyMuPDF" },
  { step: "02", title: "Chunking", desc: "Potong teks jadi segmen 700 karakter, overlap 150" },
  { step: "03", title: "Metadata", desc: "Tag tiap chunk dengan nama file sumber + halaman" },
  { step: "04", title: "Embedding", desc: "Vectorize chunk dengan all-MiniLM-L6-v2, simpan ke ChromaDB" },
];

export default function Presentation({ onStart }) {
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [activeBox, setActiveBox] = useState(-1);
  const [barsReady, setBarsReady] = useState(false);
  const boxTimerRef = useRef(null);

  useEffect(() => {
    setBarsReady(false);
    if (slide === 5 || slide === 6) {
      const t = setTimeout(() => setBarsReady(true), 600);
      return () => clearTimeout(t);
    }
  }, [slide]);

  useEffect(() => {
    if (slide !== 7) {
      setActiveBox(-1);
      if (boxTimerRef.current) clearInterval(boxTimerRef.current);
      return;
    }
    const startDelay = setTimeout(() => {
      setActiveBox(0);
      let i = 0;
      boxTimerRef.current = setInterval(() => {
        i = (i + 1) % 5;
        setActiveBox(i);
      }, 900);
    }, 500);
    return () => {
      clearTimeout(startDelay);
      if (boxTimerRef.current) clearInterval(boxTimerRef.current);
    };
  }, [slide]);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [slide]);

  const goTo = useCallback((n) => {
    setSlide((prev) => {
      const next = Math.max(0, Math.min(MAX_SLIDE, n));
      return next !== prev ? next : prev;
    });
  }, []);

  const next = useCallback(() => goTo(slide + 1), [slide, goTo]);
  const prev = useCallback(() => goTo(slide - 1), [slide, goTo]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (slide === MAX_SLIDE) {
          onStart();
        } else {
          goTo(slide + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goTo(slide - 1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(MAX_SLIDE);
      } else if (e.key === "Enter" && slide === MAX_SLIDE) {
        onStart();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slide, goTo, onStart]);

  useEffect(() => {
    let ticking = false;
    function handleWheel(e) {
      if (ticking) return;
      ticking = true;
      setTimeout(() => { ticking = false; }, 800);
      if (e.deltaY > 0) {
        if (slide === MAX_SLIDE) return;
        goTo(slide + 1);
      } else {
        goTo(slide - 1);
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [slide, goTo]);

  const ak = animKey;

  return (
    <div className="h-screen overflow-hidden bg-[#0c0c0c] text-stone-200 font-sans relative select-none">

      {/* Progress bar */}
      <div className="fixed top-0 left-0 h-[3px] bg-orange-500 z-30 transition-all duration-700 ease-out"
        style={{ width: `${(slide / MAX_SLIDE) * 100}%` }}
      />

      <div
        className="transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateY(-${slide * 100}vh)` }}
      >
        {/* Slide 1 — Title */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s0-${ak}`} className="text-center max-w-3xl animate-fade-up">
            <Shuffle
              text="RAG Chatbot"
              className="normal-case text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-4"
              duration={0.5}
              stagger={0.04}
              ease="power3.out"
              tag="h1"
              textAlign="center"
              shuffleDirection="right"
              shuffleTimes={2}
              loop
              loopDelay={2000}
            />
            <p className="text-xl sm:text-2xl text-stone-400 font-medium mb-6">
              Prototype chatbot berbasis Retrieval Augmented Generation (RAG) untuk menjawab pertanyaan seputar topik pemrograman, web, dan AI.
            </p>
            <p className="text-sm text-stone-600 font-mono tracking-wide">
              Qwen2.5-3B-Instruct · ChromaDB · FastAPI · React
            </p>
            <div className="mt-12 text-stone-700 text-sm animate-pulse">
              Tekan → untuk mulai
            </div>
          </div>
        </section>

        {/* Slide 2 — Dataset */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s1-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">01</span>
            <BlurText
              text="Dataset"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              animateBy="chars"
              direction="top"
              delay={80}
              stepDuration={0.35}
            />
            <p className="text-stone-500 mb-6">PDF sumber yang dijadikan basis pengetahuan chatbot:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PDFS.map((pdf, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-900/60 border border-stone-800/50 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-xs text-stone-500 font-mono">
                    {i + 1}
                  </span>
                  <span className="text-sm text-stone-300">{pdf}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Slide 3 — EDA */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s2-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">02</span>
            <BlurText
              text="Karakteristik Dataset"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              animateBy="words"
              direction="top"
              delay={60}
              stepDuration={0.35}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPICS.map((t, i) => (
                <div
                  key={i}
                  className="px-5 py-4 rounded-xl bg-stone-900/60 border border-stone-800/50 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-xs text-stone-600 uppercase tracking-wider mb-1">{t.label}</div>
                  <div className="text-base text-stone-200 font-medium">{t.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Slide 4 — Data Cleaning */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s3-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">03</span>
            <SplitText
              text="Data Cleaning"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              delay={50}
              duration={1.0}
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              tag="h2"
              textAlign="left"
            />
            <div className="space-y-5">
              {CLEANING_STEPS.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 animate-fade-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <span className="text-orange-500 font-mono text-sm font-bold w-8 shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-200">{s.title}</h3>
                    <p className="text-sm text-stone-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Slide 5 — Model */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s4-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">04</span>
            <BlurText
              text="Model"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              animateBy="chars"
              direction="top"
              delay={80}
              stepDuration={0.35}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div
                className="px-5 py-5 rounded-xl bg-stone-900/60 border border-stone-800/50 animate-fade-up"
                style={{ animationDelay: `100ms` }}
              >
                <div className="text-xs text-stone-600 uppercase tracking-wider mb-1">LLM</div>
                <div className="text-lg font-semibold">Qwen2.5-3B-Instruct</div>
                <div className="text-sm text-stone-500 mt-1">4-bit quantization (bitsandbytes)</div>
              </div>
              <div
                className="px-5 py-5 rounded-xl bg-stone-900/60 border border-stone-800/50 animate-fade-up"
                style={{ animationDelay: `200ms` }}
              >
                <div className="text-xs text-stone-600 uppercase tracking-wider mb-1">Embedding</div>
                <div className="text-lg font-semibold">all-MiniLM-L6-v2</div>
                <div className="text-sm text-stone-500 mt-1">384 dimensi, similiaritas kosinus</div>
              </div>
            </div>
            <div
              className="px-5 py-4 rounded-xl bg-stone-900/40 border border-stone-800/40 text-sm text-stone-500 animate-fade-up"
              style={{ animationDelay: `300ms` }}
            >
              Model pre-trained — tidak dilakukan fine-tuning. Pendekatan RAG (Retrieval Augmented Generation).
            </div>
          </div>
        </section>

        {/* Slide 6 — Evaluasi */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s5-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">05</span>
            <BlurText
              text="Evaluasi ROUGE"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-6"
              animateBy="words"
              direction="top"
              delay={60}
              stepDuration={0.35}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="animate-fade-up" style={{ animationDelay: `80ms` }}>
                <h3 className="text-sm text-stone-500 font-medium mb-3">Mean Score</h3>
                <BarChart label="ROUGE-1 (Unigram)" value={0.082} delay={120} ready={barsReady} />
                <BarChart label="ROUGE-2 (Bigram)" value={0.030} delay={200} ready={barsReady} />
                <BarChart label="ROUGE-L (LCS)" value={0.070} delay={280} ready={barsReady} />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: `160ms` }}>
                <h3 className="text-sm text-stone-500 font-medium mb-3">Per Kategori (R1)</h3>
                {CATEGORIES.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mb-1.5 animate-fade-up"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <span className="text-xs text-stone-500 w-16 shrink-0">{c.name}</span>
                    <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500/70 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: barsReady ? `${Math.max(c.r1 * 100, 1.5)}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-stone-500 font-mono w-10 text-right">
                      {(c.r1 * 100).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Slide 7 — Evaluasi yang Diharapkan */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s6-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">06</span>
            <BlurText
              text="Evaluasi ROUGE yang Diharapkan"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-6"
              animateBy="words"
              direction="top"
              delay={60}
              stepDuration={0.35}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="animate-fade-up" style={{ animationDelay: `80ms` }}>
                <h3 className="text-sm text-stone-500 font-medium mb-3">Target Score</h3>
                <BarChart label="ROUGE-1 (Unigram)" value={0.85} color="bg-emerald-500" delay={120} ready={barsReady} slow />
                <BarChart label="ROUGE-2 (Bigram)" value={0.80} color="bg-emerald-500" delay={200} ready={barsReady} slow />
                <BarChart label="ROUGE-L (LCS)" value={0.82} color="bg-emerald-500" delay={280} ready={barsReady} slow />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: `160ms` }}>
                <h3 className="text-sm text-stone-500 font-medium mb-3">Target Per Kategori (R1)</h3>
                {[
                  { name: "Java", value: 0.98 },
                  { name: "Coding", value: 0.97 },
                  { name: "GenAI", value: 0.95 },
                  { name: "MySQL", value: 0.96 },
                  { name: "Web", value: 0.94 },
                  { name: "Git", value: 0.92 },
                  { name: "Python", value: 0.98 },
                  { name: "Full", value: 0.905 },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mb-1.5 animate-fade-up"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <span className="text-xs text-stone-500 w-16 shrink-0">{c.name}</span>
                    <div className="flex-1 h-2 bg-stone-800 rounded-full">
                      <div
                        className="h-full bg-emerald-500/70 rounded-full animate-[bar-overflow_3s_ease-out]"
                        style={{ width: barsReady ? "150%" : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-stone-500 font-mono w-10 text-right">
                      {c.value * 100}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Slide 8 — Arsitektur */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s7-${ak}`} className="max-w-3xl w-full animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">07</span>
            <SplitText
              text="Arsitektur Prototype"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              delay={40}
              duration={1.0}
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              tag="h2"
              textAlign="left"
            />
            <div className="flex items-center justify-center gap-2 text-sm">
              {[
                { name: "React UI", sub: "Frontend" },
                { name: "Cloudflare\nTunnel", sub: "HTTPS" },
                { name: "FastAPI", sub: "Backend" },
                { name: "ChromaDB\nRetriever", sub: "k=15" },
                { name: "Qwen2.5\n3B", sub: "LLM" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className={`text-lg transition-all duration-500 ${
                      activeBox === -1 || activeBox < i ? "text-stone-700" : "text-orange-500/60"
                    }`}>→</span>
                  )}
                  <div
                    className={`min-w-[100px] px-4 py-3.5 rounded-xl text-center transition-all duration-500 ${
                      activeBox === i
                        ? "bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-[0_0_24px_-4px_rgba(251,146,60,0.2)] scale-105"
                        : "bg-stone-900/50 border border-stone-800/50 text-stone-500"
                    }`}
                  >
                    <div className="text-sm font-medium whitespace-pre-line leading-tight">{item.name}</div>
                    <div className={`text-[10px] mt-1 transition-colors duration-500 ${
                      activeBox === i ? "text-orange-600" : "text-stone-600"
                    }`}>
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    activeBox === i
                      ? "w-6 bg-orange-500"
                      : activeBox > i || activeBox === -1
                        ? "w-1.5 bg-stone-700"
                        : "w-1.5 bg-stone-700/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Slide 9 — Tim */}
        <section className="h-screen w-full flex items-center justify-center px-6">
          <div key={`s8-${ak}`} className="text-center max-w-2xl animate-fade-up">
            <span className="text-orange-500 text-sm font-mono tracking-widest">08</span>
            <BlurText
              text="Tim Kami Bang"
              className="text-3xl sm:text-4xl font-bold mt-1 mb-8"
              animateBy="chars"
              direction="top"
              delay={80}
              stepDuration={0.35}
            />
            <div className="space-y-3 mb-10">
              {[
                { name: "Mochamad Vicryandre Nurdin", role: "Pengembang" },
                { name: "Julfa Nurhakiki", role: "Dokumentasi" },
                { name: "Ainun Nazza", role: "Penguji" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="px-6 py-4 rounded-xl bg-stone-900/60 border border-stone-800/50 max-w-sm mx-auto animate-fade-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="text-base font-semibold text-stone-200">{m.name}</div>
                  <div className="text-xs text-stone-600 mt-0.5">{m.role}</div>
                </div>
              ))}
            </div>
            <Button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-base animate-pulse-glow"
            >
              Mulai Chat
              <ArrowRight className="size-[18px] stroke-[2.5]" />
            </Button>
            <p className="text-xs text-stone-700 mt-4 animate-fade-up" style={{ animationDelay: `500ms` }}>
              Tekan Enter atau → untuk lanjut
            </p>
          </div>
        </section>
      </div>

      {/* Fixed side buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20"
        aria-label="Previous"
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => slide === MAX_SLIDE ? onStart() : next()}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-20"
        aria-label={slide === MAX_SLIDE ? "Start chat" : "Next"}
      >
        <ArrowRightIcon />
      </Button>

      <SlideCounter current={slide} total={MAX_SLIDE + 1} onDotClick={goTo} />
      <SlideLabel current={slide} total={MAX_SLIDE + 1} onPrev={prev} onNext={() => slide === MAX_SLIDE ? onStart() : next()} />
    </div>
  );
}
