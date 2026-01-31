
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
from mcp_server import (
    _search_web_impl,
    _read_page_impl,
    _deep_research_impl,
    _summarize_page_impl,
    _generate_graph_impl
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("LOADING API.PY - VERSION WITH GRAPH ENDPOINT", file=sys.stderr)

app = FastAPI(title="Web Search Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SearchRequest(BaseModel):
    query: str

class UrlRequest(BaseModel):
    url: str

class ResearchRequest(BaseModel):
    topic: str

class GraphRequest(BaseModel):
    topic: str

# Middleware to log requests (helpful for debugging 404s)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Endpoints Implementation

@app.post("/api/search")
async def search(request: SearchRequest):
    try:
        result = await _search_web_impl(request.query)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/read")
async def read_page(request: UrlRequest):
    try:
        result = await _read_page_impl(request.url)
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/research")
async def deep_research(request: ResearchRequest):
    try:
        result = await _deep_research_impl(request.topic)
        return {"report": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
async def summarize(request: UrlRequest):
    try:
        result = await _summarize_page_impl(request.url)
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/graph")
async def generate_graph(request: GraphRequest):
    try:
        result = await _generate_graph_impl(request.topic)
        return {"graph": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Web Search Agent API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
