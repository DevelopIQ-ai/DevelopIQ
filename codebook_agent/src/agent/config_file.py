"""Define the configurable parameters for the municipal code retrieval agent."""

from __future__ import annotations

from dataclasses import dataclass, fields
from typing import Optional

from langchain_core.runnables import RunnableConfig


@dataclass(kw_only=True)
class Configuration:
    """The configuration for the municipal code retrieval agent."""

    # Municipal code retrieval parameters
    municipality: str = "Bargersville"
    state: str = "IN"
    zone_code: str = "RR"
    model_name: str = "gpt-4o-mini"
    test_mode: bool = False
    use_html_cache: bool = True
    use_chunk_cache: bool = True
    use_query_cache: bool = False
    
    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> Configuration:
        """Create a Configuration instance from a RunnableConfig object."""
        configurable = (config.get("configurable") or {}) if config else {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})