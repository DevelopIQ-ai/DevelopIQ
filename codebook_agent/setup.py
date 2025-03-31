from setuptools import setup, find_packages

setup(
    name="codebook_agent",
    version="0.0.1",
    description="Agent for analyzing municipal codebooks using LangGraph.",
    packages=find_packages(include=["src", "src.*"]),
    install_requires=[
        "langgraph>=0.2.6",
        "python-dotenv>=1.0.1",
        "requests>=2.31.0",
        "langchain-openai>=0.0.5",
        "langchain-core>=0.1.27",
    ],
)