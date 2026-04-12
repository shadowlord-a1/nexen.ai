import React from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  tools: string[];
  image: string;
  githubUrl: string;
}

export default function ProjectCard({ title, description, tools, image, githubUrl }: ProjectCardProps) {
  return (
    <div className="glass rounded-2xl p-6 fade-up flex flex-col h-full hover:border-[#CCFF00] hover:shadow-[0_0_20px_rgba(204,255,0,0.1)] transition-all duration-300" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-black/50 border border-white/[0.04]">
        <Image src={image} alt={title} fill className="object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <h3 className="font-display font-700 text-xl tracking-tighter mb-3 truncate">{title}<span className="text-[#CCFF00]">.</span></h3>
      <p className="text-white/40 text-sm mb-6 flex-grow">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map(tool => (
          <span key={tool} className="px-3 py-1 font-mono text-[10px] tracking-wider text-[#00F0FF] bg-white/[0.03] border border-white/[0.06] rounded-full uppercase">
            {tool}
          </span>
        ))}
      </div>
      
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="mag-btn relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#CCFF00] text-black font-mono font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-colors w-full">
        <span>View Workflow</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
