"""LangGraph state schema for the multi-agent QA flow."""

from typing import TypedDict, List, Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class QAState(TypedDict):
    """State schema for the linear multi-agent QA flow.

    The state flows through four agents:
    1. Planning Agent: Decomposes the `question` into a `plan` and `sub_questions`.
    2. Retrieval Agent: Populates `context` by executing searches for each sub-question.
    3. Summarization Agent: Generates `draft_answer` from `question` + `context`.
    4. Verification Agent: Produces final `answer` from `question` + `context` + `draft_answer`.
    """

    question: str
    plan: str | None 
    sub_questions: list[str] | None
    context: str | None
    draft_answer: str | None
    answer: str | None
    messages: Annotated[List[BaseMessage], add_messages]