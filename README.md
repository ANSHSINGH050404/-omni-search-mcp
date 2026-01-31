# Web Search Agent MCP Server

A powerful Model Context Protocol (MCP) server that gives your LLM the ability to search the web, read pages, and perform deep research autonomously.

## Features

- **🔍 Search Web**: Real-time Google Search results via Serper API.
- **📖 Read Page**: Fetches clean, markdown-formatted content from any URL using Jina Reader.
- **🧠 Deep Research (Viral Feature)**: One-shot research tool that searches, reads multiple top sources, and synthesizes a comprehensive answer with citations.
- **📝 Summarize Page**: Instantly summarizes long articles or web pages using Gemini AI.

## Setup

1.  **Install Dependencies**:
    ```bash
    uv sync
    ```

2.  **Configure Environment**:
    Create a `.env` file with your API keys:
    ```env
    SERPER_API_KEY=your_serper_key_here
    GEMINI_API_KEY=your_gemini_key_here
    ```

3.  **Run Server**:
    ```bash
    uv run mcp_server.py
    ```

4.  **Test Client**:
    ```bash
    uv run client.py
    ```

## Tools

| Tool Name | Description |
| :--- | :--- |
| `search_web` | Search Google for top results. |
| `read_page` | Get clean Markdown content from a URL. |
| `deep_research` | **Autonomous Agent**: Searches -> Reads -> Synthesizes. |
| `summarize_page`| **AI Assistant**: Reads -> Summarizes. |

## Tech Stack

- **FastMCP**: High-performance MCP server framework.
- **Serper**: fast Google Search API.
- **Jina Reader**: URL to LLM-friendly text.
- **Google Gemini**: State-of-the-art AI for synthesis and summarization.
