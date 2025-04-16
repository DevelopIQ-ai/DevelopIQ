"""
Agent module for the codebook analysis system.
"""

# Use relative imports instead of absolute package imports
from agent_graphs.extractor_graph import graph as extractor_graph
from agent_graphs.querier_graph import graph as querier_graph

__all__ = ["extractor_graph", "querier_graph"]