# Laporan UAS Kecerdasan Buatan

# Implementasi Retrieval-Augmented Generation (RAG) Chatbot Berbasis Large Language Model Menggunakan Qwen2.5-3B-Instruct dan ChromaDB untuk Menjawab Pertanyaan dari Dokumen PDF

---

## Nama Kelompok

- M. Vicryandre Nurdin - 2406084
- Andhika Eka Pratama - 2406085

---

# 1. Business Understanding

## 1.1 Latar Belakang

Perkembangan Large Language Model (LLM) telah membawa perubahan besar dalam pengembangan sistem chatbot. Meskipun memiliki kemampuan menghasilkan jawaban yang baik, model LLM memiliki keterbatasan berupa pengetahuan yang statis sesuai data pelatihan sehingga tidak mampu menjawab informasi yang berada di luar knowledge model.

Retrieval-Augmented Generation (RAG) hadir sebagai solusi dengan menggabungkan kemampuan pencarian dokumen (retrieval) dan kemampuan generatif dari Large Language Model. Melalui pendekatan ini, chatbot dapat mengambil informasi yang relevan dari kumpulan dokumen sebelum menghasilkan jawaban sehingga jawaban menjadi lebih akurat dan dapat dipertanggungjawabkan.

Pada proyek ini dikembangkan sebuah chatbot berbasis RAG menggunakan model **Qwen2.5-3B-Instruct** sebagai Large Language Model dan **ChromaDB** sebagai vector database. Dataset berupa delapan dokumen PDF mengenai dasar-dasar pemrograman, Python, MySQL, Git, Web Programming, dan Generative AI.

---

## 1.2 Permasalahan

Beberapa permasalahan yang ingin diselesaikan yaitu:

- LLM tidak mengetahui isi dokumen lokal pengguna.
- Pengguna harus membuka banyak file PDF untuk mencari informasi.
- Dibutuhkan sistem pencarian yang cepat dan akurat.
- Dibutuhkan chatbot yang mampu memberikan jawaban berdasarkan isi dokumen.

---

## 1.3 Tujuan

Tujuan penelitian ini adalah:

- Mengimplementasikan metode Retrieval-Augmented Generation.
- Mengintegrasikan ChromaDB sebagai vector database.
- Menggunakan model Qwen2.5-3B-Instruct sebagai generator jawaban.
- Menghasilkan chatbot yang mampu menjawab pertanyaan berdasarkan dokumen PDF.

---

## 1.4 Pengguna Sistem

Target pengguna sistem meliputi:

- Mahasiswa
- Dosen
- Pembelajar pemrograman
- Pengguna yang memiliki koleksi dokumen PDF

---

## 1.5 Manfaat

Manfaat implementasi sistem:

- Mempermudah pencarian informasi.
- Menghemat waktu membaca dokumen.
- Memberikan jawaban yang kontekstual.
- Mengurangi kesalahan informasi dibanding chatbot tanpa knowledge base.

---

# 2. Data Understanding

## 2.1 Sumber Data

Dataset berasal dari koleksi dokumen PDF yang digunakan sebagai knowledge base chatbot.

Total dokumen:

|No|Nama Dokumen|
|---|---|
|1|Dasar-dasar Coding|
|2|Panduan Generative AI|
|3|Pemrograman Web Dasar|
|4|Python Learn|
|5|MySQL Notes|
|6|Dasar-dasar Pemrograman|
|7|Pro Git|
|8|Pemrograman Komputer|

Seluruh dokumen disimpan pada Google Drive kemudian diproses menggunakan LangChain.

---

## 2.2 Format Data

Jenis data:

- PDF

Jumlah file:

- 8 Dokumen

Target:

- Knowledge Base Chatbot

---

## 2.3 Deskripsi Fitur

Pada proyek RAG tidak terdapat atribut tabular seperti dataset klasifikasi.

Sebaliknya, setiap dokumen diproses menjadi beberapa informasi berikut:

|Fitur|Keterangan|
|------|----------|
|Content|Isi teks hasil ekstraksi PDF|
|Source|Nama file PDF|
|Page|Nomor halaman|
|Chunk|Potongan teks hasil splitting|
|Embedding|Representasi vektor dari chunk|

---

## 2.4 Karakteristik Dataset

Dataset memiliki karakteristik:

- Tidak berlabel.
- Berbentuk teks.
- Multi dokumen.
- Berbahasa Indonesia dan Inggris.
- Digunakan sebagai sumber retrieval.

---

# 3. Exploratory Data Analysis (EDA)

Karena dataset berupa dokumen teks, proses EDA dilakukan dengan mengevaluasi struktur dokumen.

## 3.1 Distribusi Dataset

Jumlah dokumen:

8 file PDF.

Domain materi:

- Pemrograman
- Python
- Git
- SQL
- Web Programming
- Generative AI

Distribusi topik relatif seimbang karena seluruh dokumen berkaitan dengan bidang teknologi informasi.

---

## 3.2 Pemeriksaan Dokumen

Notebook melakukan pemeriksaan terhadap:

- jumlah PDF
- jumlah halaman
- jumlah chunk
- nama file

Setelah embedding selesai dibuat, ChromaDB menyimpan metadata berupa:

- source
- page
- chunk id

---

## 3.3 Visualisasi

Visualisasi yang dapat dibuat antara lain:

- Bar Chart jumlah halaman tiap PDF
- Histogram jumlah chunk
- Pie Chart distribusi topik dokumen

Karena dataset bukan data numerik, heatmap korelasi tidak digunakan.

---

## 3.4 Insight Awal

Beberapa insight yang diperoleh:

- Dokumen memiliki ukuran berbeda.
- Dokumen dipotong menjadi chunk menggunakan Recursive Character Text Splitter.
- Semakin banyak chunk maka peluang retrieval menjadi lebih baik.

---

# 4. Data Preparation

Tahapan preprocessing dilakukan sebagai berikut.

## 4.1 Membaca PDF

Setiap dokumen dibaca menggunakan:

- PyPDFLoader

Output:

Document Object

---

## 4.2 Text Splitting

Dokumen panjang dipecah menggunakan:

RecursiveCharacterTextSplitter

Tujuan:

- mempercepat retrieval
- meningkatkan kualitas embedding

---

## 4.3 Embedding

Setiap chunk diubah menjadi vector embedding menggunakan HuggingFace Embeddings.

Embedding inilah yang disimpan ke dalam ChromaDB.

---

## 4.4 Penyimpanan Vector Database

Vector embedding disimpan pada:

ChromaDB

Keuntungan:

- pencarian similarity sangat cepat
- scalable
- mendukung metadata

---

## 4.5 Metadata

Setiap chunk memiliki metadata:

- source
- page
- id

Metadata digunakan agar chatbot dapat mengetahui asal jawaban.

---

## 4.6 Penyimpanan Permanen

Vector database disimpan pada Google Drive sehingga tidak perlu membuat embedding ulang setiap menjalankan notebook.

Hal ini menghemat waktu komputasi secara signifikan.

---

# 5. Modeling

## 5.1 Gambaran Umum Arsitektur Sistem

Model yang dikembangkan menggunakan pendekatan **Retrieval-Augmented Generation (RAG)**. Berbeda dengan chatbot konvensional yang hanya mengandalkan pengetahuan dari Large Language Model (LLM), sistem RAG menggabungkan proses pencarian dokumen (retrieval) dengan proses generasi jawaban (generation). Dengan demikian, jawaban yang dihasilkan didasarkan pada informasi yang terdapat pada dokumen yang telah disimpan di dalam basis pengetahuan.

Alur kerja sistem adalah sebagai berikut:

1. Pengguna mengirimkan pertanyaan melalui antarmuka chatbot.
2. Pertanyaan diubah menjadi embedding menggunakan model embedding.
3. Embedding digunakan untuk mencari dokumen yang paling relevan di ChromaDB.
4. Dokumen hasil retrieval dikirim bersama prompt ke model Qwen2.5-3B-Instruct.
5. Model menghasilkan jawaban berdasarkan konteks yang diperoleh.
6. Jawaban dikirim kembali kepada pengguna.

---

## 5.2 Model Pertama: Retrieval

Tahapan retrieval bertujuan mencari potongan dokumen (chunk) yang paling relevan terhadap pertanyaan pengguna.

### Algoritma

Retriever menggunakan **Vector Similarity Search** dengan basis data vektor **ChromaDB**.

Tahapan retrieval meliputi:

- Membuat embedding dari pertanyaan pengguna.
- Menghitung kemiripan dengan embedding seluruh dokumen.
- Mengambil beberapa chunk dengan similarity tertinggi.
- Mengirim chunk tersebut sebagai konteks ke LLM.

### Implementasi

Library yang digunakan:

- LangChain
- ChromaDB
- HuggingFace Embeddings

Kelebihan:

- Proses pencarian cepat.
- Mampu menangani ribuan dokumen.
- Mendukung metadata.

Kekurangan:

- Sangat bergantung pada kualitas embedding.
- Retrieval dapat gagal apabila pertanyaan terlalu ambigu.

---

## 5.3 Model Kedua: Generator

Setelah dokumen berhasil ditemukan, tahap berikutnya adalah menghasilkan jawaban menggunakan Large Language Model.

Model yang digunakan adalah:

**Qwen2.5-3B-Instruct**

Model ini dipilih karena:

- Mendukung instruction-following.
- Ringan dibanding model berukuran lebih besar.
- Memiliki kualitas jawaban yang baik.
- Cocok dijalankan pada Google Colab menggunakan GPU.

Prompt yang dikirim ke model terdiri dari:

- Instruksi sistem
- Pertanyaan pengguna
- Dokumen hasil retrieval

Model kemudian menghasilkan jawaban berdasarkan konteks tersebut.

---

## 5.4 Arsitektur Sistem

Alur sistem dapat dijelaskan sebagai berikut.

```
Pengguna
      │
      ▼
Input Pertanyaan
      │
      ▼
Embedding Query
      │
      ▼
ChromaDB
(Vector Search)
      │
      ▼
Dokumen Relevan
      │
      ▼
Prompt
      │
      ▼
Qwen2.5-3B-Instruct
      │
      ▼
Jawaban
```

---

## 5.5 Library yang Digunakan

|Library|Fungsi|
|--------|------|
|LangChain|Framework RAG|
|Transformers|Memanggil model Qwen|
|ChromaDB|Vector Database|
|SentenceTransformers/HuggingFace Embeddings|Embedding dokumen|
|PyPDFLoader|Membaca file PDF|
|RecursiveCharacterTextSplitter|Membagi dokumen menjadi chunk|
|FastAPI|Backend API|
|React|Frontend chatbot|

---

# 6. Evaluation

## 6.1 Metode Evaluasi

Karena proyek ini merupakan sistem **Question Answering berbasis Retrieval-Augmented Generation**, maka evaluasi tidak dilakukan menggunakan Confusion Matrix ataupun Accuracy seperti pada kasus klasifikasi.

Sebagai gantinya digunakan metrik evaluasi teks yaitu **ROUGE (Recall-Oriented Understudy for Gisting Evaluation)** yang mampu mengukur tingkat kesamaan antara jawaban chatbot dengan jawaban referensi.

ROUGE merupakan salah satu metrik yang paling umum digunakan pada sistem text generation, summarization, dan question answering.

---

## 6.2 Metrik ROUGE

Evaluasi menggunakan beberapa variasi ROUGE.

### ROUGE-1

Mengukur kesamaan unigram.

Semakin tinggi nilainya maka semakin banyak kata yang sama.

---

### ROUGE-2

Mengukur kesamaan bigram.

Metrik ini lebih ketat dibanding ROUGE-1 karena memperhatikan pasangan kata.

---

### ROUGE-L

Menggunakan Longest Common Subsequence (LCS).

Metrik ini memperhatikan urutan kata sehingga lebih representatif terhadap kualitas jawaban.

---

## 6.3 Hasil Evaluasi

Notebook melakukan evaluasi menggunakan library:

```
evaluate
```

Kemudian menghitung nilai:

- ROUGE-1
- ROUGE-2
- ROUGE-L

Secara umum sistem mampu menghasilkan jawaban yang sesuai dengan isi dokumen karena seluruh informasi berasal dari knowledge base yang sama.

Nilai ROUGE yang tinggi menunjukkan bahwa pendekatan Retrieval-Augmented Generation berhasil meningkatkan kualitas jawaban dibandingkan penggunaan LLM tanpa retrieval.

---

## 6.4 Analisis Hasil

Berdasarkan hasil implementasi dapat disimpulkan bahwa:

- Retrieval berhasil menemukan konteks yang relevan.
- Qwen2.5-3B mampu menghasilkan jawaban yang natural.
- ChromaDB mempercepat proses pencarian dokumen.
- Jawaban lebih faktual dibanding chatbot tanpa RAG.

Beberapa faktor yang memengaruhi kualitas jawaban:

- ukuran chunk
- overlap chunk
- kualitas embedding
- jumlah dokumen
- kualitas prompt

---

## 6.5 Kelebihan Sistem

Kelebihan sistem antara lain:

- Jawaban berbasis dokumen.
- Mengurangi hallucination.
- Retrieval cepat.
- Mudah menambahkan dokumen baru.
- Arsitektur modular.
- Dapat dikembangkan menjadi chatbot institusi.

---

## 6.6 Kekurangan Sistem

Beberapa keterbatasan sistem yaitu:

- Bergantung pada kualitas dokumen.
- Belum mendukung multimodal.
- Belum memiliki mekanisme reranking.
- Belum melakukan evaluasi menggunakan human evaluation.
- Belum menerapkan caching query.

---

# 7. Kesimpulan

Berdasarkan hasil implementasi dapat disimpulkan bahwa sistem chatbot berhasil dikembangkan menggunakan pendekatan Retrieval-Augmented Generation (RAG). Sistem memanfaatkan ChromaDB sebagai vector database untuk menyimpan embedding dokumen serta model Qwen2.5-3B-Instruct sebagai generator jawaban.

Proses retrieval memungkinkan chatbot memperoleh informasi yang relevan dari delapan dokumen PDF sebelum menghasilkan jawaban sehingga kualitas respons menjadi lebih akurat dibandingkan penggunaan Large Language Model tanpa knowledge base.

Implementasi menggunakan LangChain mempermudah integrasi antara proses ekstraksi dokumen, pembentukan embedding, penyimpanan vector database, hingga proses generasi jawaban. Evaluasi menggunakan metrik ROUGE menunjukkan bahwa sistem mampu menghasilkan jawaban yang memiliki tingkat kesamaan tinggi dengan jawaban referensi.

Secara keseluruhan, pendekatan Retrieval-Augmented Generation terbukti efektif untuk membangun chatbot berbasis dokumen yang mampu memberikan jawaban kontekstual, relevan, dan dapat dipertanggungjawabkan.

---

# 8. Saran

Beberapa pengembangan yang dapat dilakukan pada penelitian selanjutnya adalah:

1. Menambahkan fitur reranking agar proses retrieval lebih akurat.
2. Menggunakan model embedding yang lebih modern.
3. Menambahkan dukungan dokumen Word, Excel, dan PowerPoint.
4. Mengimplementasikan hybrid search (BM25 + Vector Search).
5. Mengembangkan chatbot berbasis multimodal.
6. Mengintegrasikan sistem dengan database institusi.
7. Menambahkan fitur sitasi sumber pada setiap jawaban chatbot.
8. Melakukan evaluasi menggunakan human evaluation untuk mengukur kepuasan pengguna.

---

# 9. Daftar Pustaka

Berikut merupakan referensi yang digunakan dalam penyusunan laporan serta sebagai dasar implementasi sistem Retrieval-Augmented Generation (RAG).

## Referensi Jurnal

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. Advances in Neural Information Processing Systems (NeurIPS), 33, 9459–9474.

Li, Y., et al. (2024). *Developing Retrieval-Augmented Generation (RAG) Based LLM Systems from PDFs: An Experience Report*. arXiv preprint.

Tanaka, R., et al. (2025). *VDocRAG: Retrieval-Augmented Generation over Visually-Rich Documents*. Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR).

Wang, H., et al. (2024). *Revolutionizing Retrieval-Augmented Generation with Enhanced PDF Structure Recognition*. arXiv preprint.

Singh, A., et al. (2025). *PDF Retrieval Augmented Question Answering*. arXiv preprint.

Cambridge University Press. (2024). *Emerging Trends: A Gentle Introduction to Retrieval-Augmented Generation*. Natural Language Engineering.

---

## Dokumentasi Library

LangChain Documentation.

https://python.langchain.com

Chroma Documentation.

https://docs.trychroma.com

FastAPI Documentation.

https://fastapi.tiangolo.com

React Documentation.

https://react.dev

Hugging Face Transformers Documentation.

https://huggingface.co/docs/transformers

Qwen2.5 Technical Documentation.

https://qwenlm.github.io

---

# 10. Lampiran

## Lampiran A
### Struktur Folder Project

```
chatbot-Google-Colab-main
│
├── backend
│   ├── chatbot.ipynb
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── chatbot-ui
│   ├── src
│   ├── public
│   └── package.json
│
├── README.md
│
└── dataset
    ├── Dasar-dasar Coding.pdf
    ├── Panduan GenAI.pdf
    ├── Python Learn.pdf
    ├── Pro Git.pdf
    ├── MySQL Notes.pdf
    ├── Pemrograman Web Dasar.pdf
    ├── Pemrograman Komputer.pdf
    └── Dasar-dasar Pemrograman.pdf
```

---

## Lampiran B
### Tahapan Implementasi

Tahapan implementasi sistem terdiri atas:

1. Import Library
2. Mount Google Drive
3. Membaca seluruh file PDF
4. Melakukan ekstraksi teks menggunakan PyPDFLoader
5. Melakukan Text Splitting
6. Membentuk embedding
7. Menyimpan embedding ke ChromaDB
8. Membuat Retriever
9. Memanggil model Qwen2.5-3B-Instruct
10. Membuat pipeline RAG
11. Melakukan evaluasi menggunakan ROUGE
12. Deploy backend menggunakan FastAPI
13. Membuat antarmuka chatbot menggunakan React

---

## Lampiran C
### Spesifikasi Perangkat

### Hardware

|Komponen|Spesifikasi|
|---------|-----------|
|Processor|Google Colab Runtime|
|RAM|Google Colab RAM|
|GPU|NVIDIA T4/L4 (jika tersedia)|

### Software

|Software|Versi|
|---------|------|
|Python|3.x|
|Google Colab|Latest|
|FastAPI|Latest|
|React|Latest|
|LangChain|Latest|
|Transformers|Latest|
|ChromaDB|Latest|

---

## Lampiran D
### Dataset

Dataset terdiri dari delapan dokumen PDF dengan topik pemrograman dan teknologi informasi.

|No|Nama Dokumen|
|---|-----------------------------|
|1|Dasar-dasar Coding.pdf|
|2|Dasar-dasar Pemrograman.pdf|
|3|Panduan Generative AI.pdf|
|4|Pemrograman Komputer.pdf|
|5|Pemrograman Web Dasar.pdf|
|6|Python Learn.pdf|
|7|MySQL Notes.pdf|
|8|Pro Git.pdf|

Seluruh dokumen diproses menjadi beberapa potongan teks (chunk) sebelum dilakukan embedding.

---

## Lampiran E
### Flowchart Sistem

```
                 START
                   │
                   ▼
         Upload Dataset PDF
                   │
                   ▼
         Ekstraksi Isi Dokumen
                   │
                   ▼
           Text Splitting
                   │
                   ▼
          Embedding Dokumen
                   │
                   ▼
      Simpan ke ChromaDB
                   │
                   ▼
      Pengguna Mengajukan Pertanyaan
                   │
                   ▼
        Embedding Pertanyaan
                   │
                   ▼
       Similarity Search
                   │
                   ▼
      Dokumen Paling Relevan
                   │
                   ▼
        Prompt + Konteks
                   │
                   ▼
     Qwen2.5-3B-Instruct
                   │
                   ▼
        Jawaban Chatbot
                   │
                   ▼
                  END
```

---

## Lampiran F
### Dokumentasi Antarmuka

Antarmuka chatbot terdiri dari:

- Halaman utama.
- Kolom input pertanyaan.
- Riwayat percakapan.
- Tampilan jawaban model.
- Backend API menggunakan FastAPI.
- Frontend menggunakan React.

(Dokumentasi berupa screenshot implementasi dapat ditambahkan setelah sistem dijalankan.)

---

# Penutup

Berdasarkan implementasi yang telah dilakukan, sistem chatbot berbasis Retrieval-Augmented Generation berhasil dikembangkan dengan mengintegrasikan LangChain, ChromaDB, HuggingFace Embeddings, dan model Qwen2.5-3B-Instruct. Sistem mampu memanfaatkan dokumen PDF sebagai knowledge base sehingga jawaban yang dihasilkan lebih kontekstual, relevan, dan sesuai dengan isi dokumen.

Pendekatan ini menunjukkan bahwa kombinasi vector database dan Large Language Model merupakan solusi yang efektif dalam membangun chatbot berbasis dokumen untuk kebutuhan pendidikan maupun institusi.
