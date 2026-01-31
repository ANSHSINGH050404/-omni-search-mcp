
import os
from google import genai
import trafilatura

import os
from google import genai
import trafilatura

def clean_html_to_text(html):

    try:
        extracted = trafilatura.extract(
            html,
            include_comments=False,
            include_tables=False,
            favor_precision=True,
        )
        if extracted:
            return extracted
    except Exception as e:
        pass
    return ""


async def call_gemini(prompt: str, model_id: str = 'gemini-2.0-flash') -> str:
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Calling Gemini with model {model_id}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY not found in environment variables. Please add it to your .env file."

    client = genai.Client(api_key=api_key)
    
    models_to_try = [model_id]
    for m in ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"]:
        if m not in models_to_try:
            models_to_try.append(m)
    
    last_error = None

    for model in models_to_try:
        try:
            import asyncio
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=model,
                contents=prompt
            )
            logger.info(f"Successfully got response from model {model}")
            return response.text
        except Exception as e:
            logger.warning(f"Failed to get response from model {model}: {str(e)}")
            last_error = e
            continue

    return f"Error calling Gemini after trying multiple models. Last error: {str(last_error)}"

async def generate_summary(text: str) -> str:
    prompt = f"Please analyze the following text and provide a concise, high-level summary that captures the main points:\\n\\n{text}"
    return await call_gemini(prompt)

async def generate_answer(query: str, context: str) -> str:
    prompt = (
        f"You are an advanced AI research assistant. Your goal is to provide a comprehensive, structured, and visually appealing answer to the user's question based on the search results provided below.\\n\\n"
        f"**Instructions:**\\n"
        f"1. **Structure:** Organize your response into clear sections with bold headings (e.g., **Overview**, **Key Details**, **Implications**).\\n"
        f"2. **Formatting:** Use bullet points for readability. Use **bold** text for key terms or important figures.\\n"
        f"3. **Citations:** You MUST cite your sources. Use inline citations like [1], [2] at the end of sentences.\\n"
        f"4. **Sources Section:** At the very end, include a '***' separator followed by a '### Sources' section listing the numbered sources with their titles and URLs (e.g., [1] [Title](URL)).\\n"
        f"5. **Tone:** Professional, objective, and direct. Like a high-quality research summary.\\n"
        f"6. **Synthesize:** Do not just list results. Combine information from multiple sources to tell a coherent story.\\n\\n"
        f"**User Question:** {query}\\n\\n"
        f"**Search Results (Context):**\\n{context}"
    )
    return await call_gemini(prompt)

async def generate_graph_data(topic: str) -> str:
    prompt = (
        f"Create a detailed Mermaid.js flowchart (graph TD) that represents the structure, key concepts, and relationships for the topic: '{topic}'.\\n"
        f"Requirements:\\n"
        f"1. Use 'graph TD' (top-down) orientation.\\n"
        f"2. Every node MUST have a unique ID followed by its label in brackets. \\n"
        f"   - Use [brackets] for rectangles: ID[Label]\\n"
        f"   - Use (parens) for rounded nodes: ID(Label)\\n"
        f"   - Use {{braces}} for diamonds: ID{{Label}}\\n"
        f"3. If a label contains special characters like '&', parentheses, or quotes, wrap the WHOLE label in double quotes inside the brackets. Example: A[\\"Label with & symbol\\" ]\\n"
        f"4. Ensure all connections use '-->' and are logically structured.\\n"
        f"5. STRICT OUTPUT FORMAT: Return ONLY the Mermaid code. No markdown code blocks. No 'Here is the graph'. No explanations. Start the response with 'graph TD'.\\n"
    )
    return await call_gemini(prompt)

async def generate_answer(query: str, context: str) -> str:
    """Generates an answer to the query based on the provided context."""
    prompt = (
        f"You are an advanced AI research assistant. Your goal is to provide a comprehensive, structured, and visually appealing answer to the user's question based on the search results provided below.\n\n"
        f"**Instructions:**\n"
        f"1. **Structure:** Organize your response into clear sections with bold headings (e.g., **Overview**, **Key Details**, **Implications**).\n"
        f"2. **Formatting:** Use bullet points for readability. Use **bold** text for key terms or important figures.\n"
        f"3. **Citations:** You MUST cite your sources. Use inline citations like [1], [2] at the end of sentences.\n"
        f"4. **Sources Section:** At the very end, include a '***' separator followed by a '### Sources' section listing the numbered sources with their titles and URLs (e.g., [1] [Title](URL)).\n"
        f"5. **Tone:** Professional, objective, and direct. Like a high-quality research summary.\n"
        f"6. **Synthesize:** Do not just list results. Combine information from multiple sources to tell a coherent story.\n\n"
        f"**User Question:** {query}\n\n"
        f"**Search Results (Context):**\n{context}"
    )
    return await call_gemini(prompt)

async def generate_graph_data(topic: str) -> str:
    """Generates Mermaid.js graph data for a given topic."""
    prompt = (
        f"Create a detailed Mermaid.js flowchart (graph TD) that represents the structure, key concepts, and relationships for the topic: '{topic}'.\n"
        f"Requirements:\n"
        f"1. Use 'graph TD' (top-down) orientation.\n"
        f"2. Every node MUST have a unique ID followed by its label in brackets. \n"
        f"   - Use [brackets] for rectangles: ID[Label]\n"
        f"   - Use (parens) for rounded nodes: ID(Label)\n"
        f"   - Use {{braces}} for diamonds: ID{{Label}}\n"
        f"3. If a label contains special characters like '&', parentheses, or quotes, wrap the WHOLE label in double quotes inside the brackets. Example: A[\"Label with & symbol\"]\n"
        f"4. Ensure all connections use '-->' and are logically structured.\n"
        f"5. STRICT OUTPUT FORMAT: Return ONLY the Mermaid code. No markdown code blocks. No 'Here is the graph'. No explanations. Start the response with 'graph TD'.\n"
    )
    return await call_gemini(prompt)
