import asyncio
import os
import sys
from dotenv import load_dotenv

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

# Since you are using 'uv', let's use 'uv' to launch the server too.
# This ensures all dependencies in your pyproject.toml / uv.lock are respected.
server_params = StdioServerParameters(
    command="uv", 
    args=["run", "mcp_server.py"], 
    env={**os.environ, "PYTHONUNBUFFERED": "1"} 
)

async def main():
    print(f"Directory: {os.getcwd()}")
    print("Starting MCP Client via UV...")
    
    try:
        # We use a shorter timeout for initialization to catch hangs early
        async with stdio_client(server_params) as (read_stream, write_stream):
            async with ClientSession(read_stream, write_stream) as session:
                
                print("Connecting to session...")
                await session.initialize()
                print("[OK] Connected!")

                tools = await session.list_tools()
                print(f"Available tools: {[t.name for t in tools.tools]}")

                # Test deep research (if configured)
                print("\n--- Testing Deep Research (Viral Feature) ---")
                print("Query: 'Latest Cricket news of india list you see on webpage'\n")
                result = await session.call_tool("deep_research", {"topic": "Latest Cricket news of india"})
                
                # Check for content attribute vs text
                output = result.content[0].text if result.content else "No content"
                print(f"\nResult:\n{output[:500]}...\n(truncated for display)")

    except Exception as e:

        # This will now print the actual underlying error
        print(f"\n[Error] MCP Error: {type(e).__name__} - {e}")
        if "Connection closed" in str(e):
            print("\nTIP: Your mcp_server.py likely has a syntax error or is missing a package.")
            print("Try running 'uv run mcp_server.py' by itself to see the crash log.")

if __name__ == "__main__":
    asyncio.run(main())