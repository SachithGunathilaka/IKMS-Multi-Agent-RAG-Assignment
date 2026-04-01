from pydantic import BaseModel, Field
from typing import List, Optional


class QueryPlan(BaseModel):
    """Schema for the structured response from the Planning Agent."""
    plan: str = Field(description="The natural language search strategy for the overall question.")
    sub_questions: List[str] = Field(description="A list of 2-3 focused sub-questions to be used for retrieval.")


class QuestionRequest(BaseModel):
    """Request body for the `/qa` endpoint.

    The PRD specifies a single field named `question` that contains
    the user's natural language question about the vector databases paper.
    """

    question: str


class QAResponse(BaseModel):
    """Response body for the `/qa` endpoint.

    From the API consumer's perspective we only expose the final,
    verified answer plus some metadata (e.g. context snippets).
    Internal draft answers remain inside the agent pipeline.
    """

    answer: str
    context: str
    plan: Optional[str] = None
    sub_questions: Optional[List[str]] = None