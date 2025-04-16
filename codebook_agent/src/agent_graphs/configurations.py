"""Define the configurable parameters for the municipal code retrieval agent."""

from __future__ import annotations

from dataclasses import dataclass, fields
from typing import Optional

from langchain_core.runnables import RunnableConfig

@dataclass(kw_only=True)
class ExtractorConfiguration:
    """The configuration for the municipal code retrieval agent."""

    model_name: str = "gpt-4o-mini"
    test_mode: bool = False

    
    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> ExtractorConfiguration:
        """Create a Configuration instance from a RunnableConfig object."""
        configurable = (config.get("configurable") or {}) if config else {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})
    
@dataclass(kw_only=True)
class QuerierConfiguration:
    """The configuration for the municipal code retrieval agent."""

    model_name: str = "gpt-4o-mini"
    test_mode: bool = False

    
    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> QuerierConfiguration:
        """Create a Configuration instance from a RunnableConfig object."""
        configurable = (config.get("configurable") or {}) if config else {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})