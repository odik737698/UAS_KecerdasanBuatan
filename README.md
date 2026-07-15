<div align="center">
  <img src="https://raw.githubusercontent.com/platane/platane/output/github-contribution-grid-snake-dark.svg" width="0" height="0" />
  <h1 align="center">
    <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Oxanium&size=36&pause=1000&color=F77609&width=600&center=true&vCenter=true&lines=Chatbot+RAG;Qwen2.5+3B+%7C+FastAPI+%7C+ChromaDB;8+PDF+%7C+RAG+Pipeline+%7C+Streaming" alt="Typing SVG" /></a>
  </h1>
  <p align="center">
    <b>Chatbot RAG berbahasa Indonesia</b> — menggabungkan LLM <b>Qwen2.5-3B-Instruct</b> (4-bit quantized) dengan vector store <b>ChromaDB</b> dan backend <b>FastAPI</b>, dibungkus dalam frontend modern <b>React + TailwindCSS</b>.
  </p>
  <p align="center">
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-fitur">Fitur</a> •
    <a href="#-struktur-proyek">Struktur</a> •
    <a href="#-panduan-instalasi">Instalasi</a> •
    <a href="#-evaluasi-rouge">ROUGE</a>
  </p>
</div>

---

##  Fitur

<table>
<tr>
<td>

- **Retrieval-Augmented Generation (RAG)** — jawaban berdasarkan 8 buku PDF (Java, Python, Git, MySQL, GenAI, Web Programming, dll)
- **LLM 4-bit Quantized** — Qwen2.5-3B-Instruct dengan BitsAndBytes `nf4`, berjalan di satu Tesla T4 (Colab)
- **Streaming Responses** — token real-time via SSE melalui FastAPI
- **Deteksi Intent Pintar** — otomatis mengklasifikasikan pertanyaan sebagai error coding, bantuan coding, pertanyaan umum, atau obrolan biasa
- **Retrieval Sadar Topik** — `detect_topic()` memetakan kata kunci ke PDF spesifik, memfilter konteks ChromaDB

</td>
<td>

- **Vector Store Persisten** — ChromaDB dengan backup Google Drive + sistem manifest untuk update PDF inkremental
- **Cloudflare Tunnel** — mengekspos backend Colab ke internet tanpa perlu deploy
- **UI Modern** — React 19 + TailwindCSS v4 + animasi GSAP + efek partikel Three.js
- **Manajemen Percakapan** — buat, rename, hapus, export, import riwayat chat
- **Dark Mode** — tema gelap premium dengan kustomisasi warna aksen
- **Evaluasi ROUGE** — benchmark 90 pertanyaan bawaan di 8 kategori PDF

</td>
</tr>
</table>

---

##  Tech Stack

### Backend & AI

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white" />
  <img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/Qwen2.5-3B-FF8C00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/BitsAndBytes-FF6F00?style=for-the-badge" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Uvicorn-4B8BBE?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ChromaDB-4A154B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/BAAI%2Fbge--m3-8E44AD?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PyPDFLoader-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloudflare%20Tunnel-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/ROUGE-0D1117?style=for-the-badge" />
</p>

### Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide%20Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

---

##  Struktur Proyek

```
 chatbot/
├──  backend/
│   └── chatbot.ipynb              # Pipeline lengkap: install → load PDF → chunk → embed → ChromaDB → load LLM → FastAPI
│
├──  chatbot-ui/                  # Frontend React
│   ├── src/
│   │   ├── components/             # Komponen UI
│   │   │   ├── ChatArea.jsx        # Daftar pesan dengan markdown
│   │   │   ├── ChatInput.jsx       # Input chat dengan tombol kirim/stop
│   │   │   ├── Sidebar.jsx         # Sidebar percakapan
│   │   │   ├── WelcomeScreen.jsx   # Halaman awal
│   │   │   ├── Presentation.jsx    # Animasi intro
│   │   │   ├── GridScan.jsx        # Efek scan-line Three.js
│   │   │   ├── SettingsModal.jsx   # Pengaturan warna aksen + grid
│   │   │   ├── MessageBubble.jsx   # Tampilan pesan chat
│   │   │   ├── TypingIndicator.jsx # Animasi loading
│   │   │   ├── CopyButton.jsx      # Tombol salin kode
│   │   │   ├── Shuffle.jsx         # Animasi teks acak
│   │   │   ├── BlurText.jsx        # Animasi blur teks
│   │   │   ├── SplitText.jsx       # Animasi pecah teks
│   │   │   └── ui/                 # Primitif shadcn/ui
│   │   ├── hooks/
│   │   │   └── useLocalStorage.js  # Hook localStorage persisten
│   │   └── App.jsx                 # Aplikasi utama dengan state management
│   ├── package.json
│   └── vite.config.js
│
├──  docs/                        # Dokumentasi & spesifikasi
├──  .gitignore
└──  README.md
```

---

##  Panduan Instalasi

### 1. Backend (Google Colab)

<a href="https://colab.research.google.com/drive/1-842e9EH3hmfSBHJSPaVHu_Cduuh_p9k" target="_blank">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Buka di Colab" />
</a>

| Langkah | Aksi |
|---------|------|
| 1 | Buka notebook di Colab |
| 2 | Jalankan semua cell — akan menginstal dependencies, load 8 PDF, chunk & embed ke ChromaDB, load Qwen2.5-3B-Instruct (4-bit), dan menjalankan FastAPI di port **8010** |
| 3 | URL Cloudflare Tunnel akan tergenerate otomatis — salin URL publiknya |
| 4 | Set `VITE_API_URL` di `chatbot-ui/.env` dengan URL tunnel kamu |

> **Catatan:** Notebook membutuhkan token Hugging Face (`HF`) yang disimpan sebagai Colab secret. Runtime GPU (Tesla T4+) sangat disarankan.

### 2. Frontend

```bash
cd chatbot-ui
cp .env.example .env
# Isi VITE_API_URL dengan URL tunnel Colab kamu

npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

---

##  Evaluasi ROUGE

Sistem memiliki benchmark otomatis **90 pertanyaan** di **8 kategori PDF**:

### ROUGE-1 (Unigram)

```mermaid
xychart-beta
    title "ROUGE-1 per Kategori"
    x-axis ["Java", "Coding", "GenAI", "MySQL", "Web", "Git", "Python", "Full"]
    y-axis "ROUGE-1" 0 --> 0.2
    bar [0.073, 0.097, 0.149, 0.043, 0.066, 0.036, 0.040, 0.063]
```

### ROUGE-2 (Bigram)

```mermaid
xychart-beta
    title "ROUGE-2 per Kategori"
    x-axis ["Java", "Coding", "GenAI", "MySQL", "Web", "Git", "Python", "Full"]
    y-axis "ROUGE-2" 0 --> 0.1
    bar [0.022, 0.050, 0.081, 0.006, 0.020, 0.008, 0.007, 0.015]
```

### ROUGE-L (Longest Common Subsequence)

```mermaid
xychart-beta
    title "ROUGE-L per Kategori"
    x-axis ["Java", "Coding", "GenAI", "MySQL", "Web", "Git", "Python", "Full"]
    y-axis "ROUGE-L" 0 --> 0.2
    bar [0.062, 0.085, 0.139, 0.041, 0.056, 0.034, 0.035, 0.057]
```

### Tabel Detail

| Kategori | Jumlah Soal | ROUGE-1 | ROUGE-2 | ROUGE-L |
|----------|:-----------:|:-------:|:-------:|:-------:|
| Java (Dasar Pemrograman) | 10 | 0.073 | 0.022 | 0.062 |
| Coding Dasar | 10 | 0.097 | 0.050 | 0.085 |
| GenAI (Buku Panduan) | 10 | **0.149** | **0.081** | **0.139** |
| MySQL | 10 | 0.043 | 0.006 | 0.041 |
| Web Programming | 10 | 0.066 | 0.020 | 0.056 |
| Git (ProGit) | 10 | 0.036 | 0.008 | 0.034 |
| Python (PythonLearn) | 20 | 0.040 | 0.007 | 0.035 |
| Komputer FULL | 10 | 0.063 | 0.015 | 0.057 |
| **Rata-rata** | **90** | **0.067** | **0.024** | **0.061** |

> **Metodologi:** Setiap jawaban model dibandingkan dengan referensi ground-truth dari PDF sumber menggunakan metrik ROUGE.

---

##  Arsitektur

```mermaid
graph LR
    A[File PDF<br/>8 buku] --> B[PyPDFLoader]
    B --> C[RecursiveCharacter<br/>TextSplitter]
    C --> D[BAAI/bge-m3<br/>Embeddings]
    D --> E[(ChromaDB<br/>Vector Store)]
    
    F[Pertanyaan<br/>Pengguna] --> G{Deteksi Intent<br/>& Topik}
    G --> H[ChromaDB<br/>Retriever]
    E --> H
    H --> I[Penyusun Konteks<br/>& Prompt]
    
    I --> J[Qwen2.5-3B-Instruct<br/>4-bit / Tesla T4]
    J --> K[FastAPI<br/>Backend]
    K --> L[Stream SSE]
    L --> M[React + TailwindCSS<br/>Frontend]
```

---

## 🛠️ Konfigurasi

| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL backend FastAPI (tunnel Colab) | `http://localhost:8010` |
| `HF_TOKEN` | Token akses Hugging Face (Colab secret) | — |
| `EMBEDDING_MODEL` | Model sentence embedding | `BAAI/bge-m3` |
| `MODEL_NAME` | Model LLM | `Qwen/Qwen2.5-3B-Instruct` |
| `CHROMA_DIR` | Path penyimpanan ChromaDB | `/content/chatbot-db/chroma_db` |
| `PDF_DIR` | Direktori sumber PDF | `/gdrive/MyDrive/chatbot-pdfs` |
| `chunk_size` | Ukuran potongan dokumen | 700 |
| `chunk_overlap` | Overlap antar potongan | 150 |
| `k` | Jumlah potongan yang di-retrieve | 15 |

---

##  Sumber PDF

| PDF | Topik |
|-----|-------|
| `03. DASAR-DASAR PEMROGRAMAN.pdf` | Java, tipe data, identifier, operator, komentar |
| `642863-dasar-dasar-coding-....pdf` | Coding, algoritma, percabangan, perulangan |
| `Buku-Panduan-GenAI-....pdf` | AI, GenAI, T.U.C.E. Framework, etika akademik |
| `MySQLNotesForProfessionals.pdf` | MySQL, JOIN, INDEX, foreign key |
| `Pemrograman Web Dasar.pdf` | HTML, CSS, JavaScript, PHP |
| `Pemrograman Komputer FULL.pdf` | Python, return, `__init__`, modul, file I/O |
| `progit.pdf` | Git, branching, rebase, stash, bisect |
| `pythonlearn.pdf` | Python dasar, strings, files, regex |

---

##  Lisensi

Proyek ini untuk tujuan pembelajaran sahaja.

---

<div align="center">
  <sub>Dibuat dengan ❤️ menggunakan Google Colab · FastAPI · React · TailwindCSS</sub>
  <br/>
  <a href="https://colab.research.google.com/drive/1-842e9EH3hmfSBHJSPaVHu_Cduuh_p9k" target="_blank">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Buka di Colab" />
  </a>
</div>
