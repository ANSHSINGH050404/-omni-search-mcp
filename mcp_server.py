import os
import httpx
import asyncio
from dotenv import load_dotenv
from fastmcp import FastMCP
from utils import call_gemini, generate_summary, generate_answer, generate_graph_data
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
SERPER_URL = "https://google.serper.dev/search"

if not SERPER_API_KEY:
    raise RuntimeError("SERPER_API_KEY not found in .env file.")

mcp = FastMCP("WebSearchAgent")

mcp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HTTP_TIMEOUT = 30.0

async def _fetch_page_content(url: str, client: httpx.AsyncClient) -> str:
    jina_url = f"https://r.jina.ai/{url}"
    try:
        response = await client.get(jina_url)
        if response.status_code != 200:
            return f"[Error: {response.status_code}]"
        return response.text
    except Exception:
        return "[Error: Failed to fetch]"


async def _search_web_impl(query: str) -> str:
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "q": query,
        "gl": "us"
    }

    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
            response = await client.post(SERPER_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

            results = []
            
            if "answerBox" in data:
                snippet = data["answerBox"].get("snippet") or data["answerBox"].get("answer")
                if snippet:
                    results.append(f"💡 DIRECT ANSWER: {snippet}\\n")

            for item in data.get("organic", [])[:5]:
                title = item.get("title", "No Title")
                link = item.get("link", "#")
                snippet = item.get("snippet", "No description available.")
                
                entry = (
                    f"Title: {title}\\n"
                    f"Link: {link}\\n"
                    f"Snippet: {snippet}\\n"
                    "---"
                )
                results.append(entry)

            return "\\n".join(results) if results else "No search results found."

    except httpx.HTTPStatusError as e:
        return f"Error: Search API returned status {e.response.status_code}."
    except Exception as e:
        return f"Error: Failed to perform search. Details: {str(e)}"

@mcp.tool()
async def search_web(query: str) -> str:
    return await _search_web_impl(query)


async def _read_page_impl(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
            content = await _fetch_page_content(url, client)
            
            if len(content) > 12000:
                content = content[:12000] + "\\n... [Content Truncated]"
                
            return content

    except Exception as e:
        return f"Error reading page: {str(e)}"

@mcp.tool()
async def read_page(url: str) -> str:
    return await _read_page_impl(url)


async def _deep_research_impl(topic: str) -> str:
    search_results = await _search_web_impl(topic)
    
    links = []
    for line in search_results.split('\\n'):
        if line.startswith("Link: "):
            links.append(line.replace("Link: ", "").strip())
    
    target_links = links[:3]
    if not target_links:
        return "No links found to research."

    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
        tasks = [_fetch_page_content(link, client) for link in target_links]
        contents = await asyncio.gather(*tasks)

    context = ""
    for i, (link, content) in enumerate(zip(target_links, contents)):
        safe_content = content[:8000] + "..." if len(content) > 8000 else content
        context += f"SOURCE {i+1} ({link}):\\n{safe_content}\\n\\n{'='*20}\\n\\n"

    final_answer = await generate_answer(topic, context)
    return final_answer

@mcp.tool()
async def deep_research(topic: str) -> str:
    return await _deep_research_impl(topic)


async def _summarize_page_impl(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
            content = await _fetch_page_content(url, client)
            if content.startswith("[Error"):\
                return content
            
            if len(content) > 12000:
                content = content[:12000]
            
            summary = await generate_summary(content)
            return f"## Summary of {url}\\n\\n{summary}"
    except Exception as e:
        return f"Error summarizing page: {str(e)}"

@mcp.tool()
async def summarize_page(url: str) -> str:
    return await _summarize_page_impl(url)


async def _generate_graph_impl(topic: str) -> str:
    return await generate_graph_data(topic)

@mcp.tool()
async def generate_graph(topic: str) -> str:
    return await _generate_graph_impl(topic)

if __name__ == "__main__":
    mcp.run()