"""
Agent module for the codebook analysis system.
"""

# Use relative imports instead of absolute package imports
from agent_graphs.extractor_graph import graph as extract_and_index_graph
from agent_graphs.querier_graph import graph as query_graph

__all__ = ["extract_and_index_graph", "query_graph"]