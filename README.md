# **IKMS Multi-Agent RAG: Query Planning Extension**

This project is an **advanced Retrieval-Augmented Generation (RAG)** system built with **LangChain v1.0** and **LangGraph**. It enhances a standard **QA pipeline** by introducing an **intelligent Planning Agent** that decomposes **complex user inquiries** into **structured search strategies** before retrieval begins.

---

## **📋 Project Overview**

The system implements a **four-stage multi-agent pipeline** designed to handle **complex, multi-part questions** that traditional **RAG systems** often miss. By analyzing the **user's intent** first, the system ensures **higher retrieval precision** and **more comprehensive answers**.

### **Key Technologies**

- **Orchestration**: **LangGraph (StateGraph)**
- **LLM**: **OpenAI GPT-4o / GPT-3.5-Turbo**
- **Vector Database**: **Pinecone**
- **API Framework**: **FastAPI**
- **Frontend**: **Streamlit**

---

## **🛠 Feature 1 Implementation: Query Planning & Decomposition**

I have implemented **Feature 1**, which addresses the limitation of **single-shot retrieval**.

#### **The Problem**

Traditional **RAG** sends the **raw user question** directly to the database. For **complex questions** like _"What are the benefits of vector databases and how do they scale?"_, the system might focus only on **"benefits"** and ignore **"scaling"**.

#### **The Solution: Agentic Planning**

- **Planning Agent**: Analyzes the question and generates a **natural language Plan** and a list of **Sub-questions**.
- **Enhanced Retrieval**: The system **iterates** through every **sub-question**, performing **multiple targeted searches** to gather a complete context.
- **Visible Reasoning**: All **planning steps** are **logged to the console** for transparency.

---

## **🚀 Getting Started**

#### **1. Prerequisites**

- **Python 3.10+**
- **OpenAI API Key**
- **Pinecone API Key & Environment**

#### **2. Installation**

```bash
# Clone the repository
git clone <github-repo-url>

# Install dependencies
uv sync


#### **3. Running the Application**
Start the Backend API:
cd BackEnd-IKMS-MultiAgent-RAG
uvicorn src.app.api:app --reload

Start the Frontend UI:
cd FrontEnd-IKMS-MultiAgent-RAG
streamlit run app.py



## 🔍 Acceptance Criteria Verification
✅ Visible Planning: The console logs clearly show the [AGENT: PLANNING] entry and exit points.
✅ Decomposition: Complex questions are broken into 2-3 focused sub-queries.
✅ Iterative Retrieval: The retrieval_node now aggregates results from multiple tool calls.
✅ UI Demonstration: The Streamlit interface displays the generated plan and sub-questions alongside the final answer.

## 📂 Repository Structure
BackEnd-IKMS-MultiAgent-RAG/: Contains the LangGraph logic, FastAPI endpoints, and agent definitions.
FrontEnd-IKMS-MultiAgent-RAG/: Streamlit frontend for interactive QA.

## 🔄 Summary of Major Changes
These are the modifications that I have done:

State Enhancement: Updated QAState in state.py to track plan and sub_questions.
New Agent Node: Created a planning_node in agents.py using a specialized PLANNING_SYSTEM_PROMPT.
Logic Refactor: Modified retrieval_node to loop through sub-questions, allowing for multiple tool calls per user request.
Graph Re-wiring: Updated graph.py to move the entry point from Retrieval to Planning (START -> planning -> retrieval).
API & Model Update: Expanded QAResponse in models.py to expose the plan and sub-questions to the frontend.
Professional Logging: Integrated detailed console logs to satisfy the "visible planning" requirement.
```
