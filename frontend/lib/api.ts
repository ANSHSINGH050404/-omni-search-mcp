const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

export type SearchResponse = {
  result: string;
};

export type ReadResponse = {
  content: string;
};

export type ResearchResponse = {
  report: string;
};

export type SummarizeResponse = {
  summary: string;
};

export type GraphResponse = {
  graph: string;
};

export async function searchWeb(query: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to search");
  const data: SearchResponse = await res.json();
  return data.result;
}

export async function readUrl(url: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to read URL");
  const data: ReadResponse = await res.json();
  return data.content;
}

export async function deepResearch(topic: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error("Failed to perform research");
  const data: ResearchResponse = await res.json();
  return data.report;
}

export async function summarizeUrl(url: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to summarize URL");
  const data: SummarizeResponse = await res.json();
  return data.summary;
}

export async function generateGraph(topic: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/graph`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error("Failed to generate graph");
  const data: GraphResponse = await res.json();
  return data.graph;
}
