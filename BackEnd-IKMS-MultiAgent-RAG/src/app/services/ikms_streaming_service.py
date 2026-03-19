"""
Streaming service for the IKMS Multi-Agent RAG system.
Uses the LangGraphToVercelAdapter to stream agentic states (Planning, Retrieval, Verification) 
to the React frontend in real-time.
"""
from typing import AsyncGenerator
from langchain_core.messages import HumanMessage
from ..core.agents.graph import run_qa_flow # Ensure this points to your compiled LangGraph
from ..core.agents.graph import get_qa_graph
from ..utils.langgraph_vercel_adapter import stream_langgraph_to_vercel


async def stream_ikms_chat(
    message: str,
    thread_id: str,
) -> AsyncGenerator[str, None]:
    
    config = {"configurable": {"thread_id": thread_id}}
    
    ikms_graph = get_qa_graph()

    initial_state = {
        "question": message,
        "plan": None,
        "sub_questions": [],
        "context": None,
        "answer": None,
        "messages": []
    }


    async for event in stream_langgraph_to_vercel(
        graph=ikms_graph, 
        initial_state=initial_state,
        config=config,
        custom_data_fields=["plan", "sub_questions", "context", "answer"], 
    ):
        yield event
