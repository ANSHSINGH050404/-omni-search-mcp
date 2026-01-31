import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chart && ref.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
      
      const renderChart = async () => {
        try {
          // Unique ID for each render to prevent conflicts
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          // Remove any existing SVG to prevent duplicates if props change quickly
          ref.current!.innerHTML = ''; 
          
          // Extract code block if present
          const codeBlockRegex = /```(?:mermaid)?\s*([\s\S]*?)```/;
          const match = chart.match(codeBlockRegex);
          
          let cleanChart = '';
          if (match) {
            cleanChart = match[1].trim();
          } else {
            // Fallback: Remove markdown tags if they exist individually but regex didn't match (rare)
            // or just use raw text if no code blocks
             cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();
          }

          const { svg } = await mermaid.render(id, cleanChart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid render error:", error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-4">Failed to render graph. Invalid syntax?</div>`;
          }
        }
      };

      renderChart();
    }
  }, [chart]);

  return (
    <div className="w-full overflow-x-auto flex justify-center p-4 bg-white dark:bg-zinc-50 rounded-lg">
      <div ref={ref} className="mermaid-chart" />
    </div>
  );
}
