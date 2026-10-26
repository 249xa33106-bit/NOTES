# Lumixora Notes AI — Complete AI Notes Generation Platform

**Lumixora Notes AI** is a production-grade, AI-powered web platform architected to generate comprehensive, technically accurate, exam-ready study notes for any academic, engineering, or scientific syllabus.

---

## 🌟 Key Features

1. **Intelligent Curriculum & Syllabus Processing**:
   - Parses university syllabus units, modules, and lecture notes directly from uploaded PDF, DOCX, and TXT files.
   - Extracts subject hierarchy, learning outcomes, and module topics.

2. **Pedagogical Notes Architecture**:
   - Complete multi-section outlines: Title, Table of Contents, Definitions, Fundamentals to Advanced Concepts, Mathematical Derivations & Properties, Architectural Flowcharts & Models, Complete Code with verified outputs, Exam Short & Long Solutions, Interactive MCQs, Viva Voce questions, and Revision Cheatsheets.

3. **Real Mermaid Visual Generation**:
   - Generates and live-renders Mermaid diagrams to SVG (flowcharts, state diagrams, class diagrams, decision trees).
   - In-app diagram controls: Zoom in/out, pan, reset zoom, fullscreen modal preview, copy rendered SVG, and live Mermaid source code editor with instant re-render.

4. **Mathematical Rigor with KaTeX**:
   - Renders inline equations (`$...$`) and display block equations (`$$...$$`).
   - Step-by-step mathematical proofs and induction derivations.

5. **Interactive Code & Execution Sandbox**:
   - Syntax-highlighted code blocks with line numbers and one-click copy.
   - Dual-tab output panel: **Expected Output (Model Verified)** vs **Live Sandbox Output (Real Execution)**.
   - Real-time client & server execution for Python & JavaScript with stdout capture.

6. **Structured Notes Reader & Editor**:
   - Sticky Table of Contents sidebar with active section tracking.
   - In-document keyword search with instant jumping.
   - Read Mode vs Edit Mode toggles.
   - Inline section title and content editing.
   - Section re-generation with custom AI instructions.
   - Document duplication, renaming, and local autosave.

7. **Dual-Format Professional Export**:
   - **Downloadable Microsoft Word (.docx)**: Generates true `.docx` files using native tables, callout blocks, styled code fonts, cover page, and headers.
   - **Downloadable Print-Ready PDF**: Clean typography, cover page, headers/footers, and page breaks.
   - **Markdown (.md)**: Clean GFM format with Mermaid and KaTeX blocks.

8. **AI Provider Abstraction**:
   - Google Gemini API (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`).
   - OpenAI API (`gpt-4o`, `gpt-4o-mini`).
   - Built-in **Lumixora High-Fidelity Academic Engine** (works 100% out of the box without requiring external API keys).

---

## 🌲 Pre-Seeded Academic Topic

The application comes pre-seeded with a comprehensive B.Tech Computer Science reference:
- **Subject**: Computer Science & Engineering
- **Topic**: Data Structures — Trees
- **Level**: B.Tech / Undergraduate
- **Coverage**: Full terminology (Root, Height, Depth, Degree, Leaf, Internal), binary tree classifications (Full, Complete, Perfect, Balanced, Degenerate), mathematical induction proof ($n_0 = n_2 + 1$), Preorder/Inorder/Postorder/Level-order traversals, BST search/insert and 3-case deletion, AVL rotations (LL, RR, LR, RL), Heaps, B-Trees, Tries, complete operational complexity comparison table, complete Python and C implementations with outputs, 2-mark & 10-mark university exam questions, interactive MCQs, and formula cheat sheet.

---

## 🚀 Suggested Routes

- `/` — Overview & Interactive Feature Showcase
- `/generate` — High-Capability Notes Generation Form & Syllabus Uploader
- `/notes/:id` — Notes Reader, Interactive Editor, and Export Center
- `/library` — Saved Notes Management, Search, Filters & Duplicate
- `/settings` — AI Provider, Model Selection, Temperature & Cloud Sync

---

## 🛠️ Installation & Development

```bash
# Install dependencies
npm install

# Start Vite Development Server
npm run dev

# Build for Production
npm run build

# Preview Production Build
npm run preview

# (Optional) Run Backend API Server
npm run server
```

---

## 🎨 Design Philosophy

- **Strict Light Mode Only** (No dark mode).
- Neutral white and slate background (`#f8fafc` / `#ffffff`) with restrained blue (`#2563eb`) and violet (`#4f46e5`, `#7c3aed`) accents.
- Accessible contrast, clear Inter typography, rounded cards, and subtle elevation shadows.
