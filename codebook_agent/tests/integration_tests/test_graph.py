import pytest
from langsmith import unit

from agent_graphs import graph


@pytest.mark.asyncio
@unit
async def test_agent_simple_passthrough() -> None:
    res = await graph.ainvoke({"changeme": "some_val"})
    assert res is not None
