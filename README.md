# **IKMS Multi-Agent RAG: Agentic Query Planning & Verification**

An advanced **Multi-Agent Retrieval-Augmented Generation (RAG)** system built with **LangGraph** and **React**. This system solves the limitations of "single-shot" retrieval by introducing:

- an autonomous **Planning Agent** (for query decomposition)
- a **Verification Agent** (to reduce hallucinations)

---

# **📋 Project Overview**

Unlike standard "one-size-fits-all" chatbots, this system implements a **four-stage multi-agent pipeline**. 
Whether you upload a technical manual, a research paper, or a financial report, the system analyzes your **specific intent** to ensure **higher retrieval precision** and **comprehensive, verified answers**.

This system uses **Stateful Multi-Agent Orchestration** to:

👉 *Think before it searches*

---

# **🚀 What the System Does**

### **Autonomous Planning**
Decomposes complex multi-part queries  
Example:
> "What was the net income in 2002 and how did it compare to 2001?"

→ Converted into structured sub-questions

---

### **Iterative Retrieval**
- Performs **multiple vector searches**
- Uses **Pinecone** for semantic retrieval
- Aggregates richer, more complete context

---

### **Fact Verification**
- A dedicated agent validates responses
- Removes unsupported or hallucinated claims

---

### **Real-time Streaming UI**
- Built with **React + Vercel AI SDK**
- Streams:
  - Planning
  - Sub-questions
  - Final answer

---

# **⚙️ How It Works (System Architecture)**

The system follows a **Directed Acyclic Graph (DAG)** using LangGraph:

### **1. Planning Node**
- Analyzes user intent
- Generates:
  - Plan
  - Sub-questions

### **2. Retrieval Node**
- Runs multiple searches using Pinecone
- Aggregates all relevant context

### **3. Summarization Node**
- Generates a draft answer from context

### **4. Verification Node**
- Checks for hallucinations
- Produces final validated response

---

# **🛠 Tech Stack**

| Component        | Technology |
|-----------------|-----------|
| Orchestration   | LangGraph (StateGraph) |
| LLM             | OpenAI GPT-4o / GPT-3.5 |
| Vector Database | Pinecone |
| Backend API     | FastAPI + Streaming |
| Frontend        | React + Tailwind + Vercel AI SDK |

---

# **🚀 Getting Started**

## **1. Prerequisites**

- Python 3.10+
- Node.js 18+
- OpenAI API Key
- Pinecone API Key
- Pinecone Index (Dimension: 1536)

---

## **2. Backend Setup**

```bash
cd BackEnd-IKMS-MultiAgent-RAG

# Install dependencies
uv sync

# Configure environment
cp .env.example .env
# Add:
# OPENAI_API_KEY=
# PINECONE_API_KEY=
# PINECONE_INDEX_NAME=

# Run API
uvicorn src.app.api:app --host 0.0.0.0 --port 8585
```
---

## **3. Frontend Setup**

```bash
cd FrontEnd-IKMS-MultiAgent-RAG

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

# **🔍 Implementation Details: Feature 1 (Query Planning)**

## **The Problem**

Traditional RAG often fails on complex queries because:
- The initial vector search is too broad  
- Secondary requirements are often ignored  
- Only partial answers are retrieved  

---

## **Our Implementation**

### **Stateful Management**
- The `QAState` object tracks:
  - plan
  - sub-questions
  - retrieved context
- Enables step-by-step reasoning across the agent pipeline

---

### **Parallel Context Aggregation**
- Instead of retrieving once:
  - The system performs retrieval **for each sub-question**
- Ensures:
  - Higher recall
  - More complete answers

---

### **Visible Reasoning**
- The React UI displays:
  - Generated Plan
  - Sub-questions
  - Final Answer
- Uses custom rendering logic to expose the agent’s internal reasoning
- Improves:
  - Transparency
  - Debugging
  - User trust

---

# **🔄 Repository Structure**

## **Backend**
```bash
BackEnd-IKMS-MultiAgent-RAG/
```

**Contains:**
- LangGraph multi-agent logic
- FastAPI endpoints
- Streaming (SSE) implementation
- Pinecone integration

---

## **Frontend**
```bash
FrontEnd-IKMS-MultiAgent-RAG/
```

**Built with:**
- React + Vite
- Tailwind CSS
- Vercel AI SDK

**Handles:**
- Real-time streaming responses
- Agent reasoning visualization
- Structured UI rendering

---

```bash
IKMS-Multi-Agent-RAG/
│
├── BackEnd-IKMS-MultiAgent-RAG/
│   ├── src/app/
│   │   ├── api.py
│   │   ├── services/
│   │   ├── core/
│   │   └── utils/
│   └── pyproject.toml
│
├── FrontEnd-IKMS-MultiAgent-RAG/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
---

# **📌 Summary**

This project demonstrates:
- ✅ Multi-Agent RAG architecture
- ✅ Query decomposition (Planning Agent)
- ✅ Iterative retrieval strategy
- ✅ Hallucination reduction (Verification Agent)
- ✅ Real-time streaming UI
- ✅ Full-stack AI system design
