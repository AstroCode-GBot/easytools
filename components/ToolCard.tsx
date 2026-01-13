
import React from 'react';
import { ToolInfo } from '../types';

interface ToolCardProps {
  tool: ToolInfo;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="tool-card group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
          <i className={`fa-solid ${tool.icon} text-xl text-blue-600 group-hover:text-white`}></i>
        </div>
        {tool.requiresAuth && (
          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Pro</span>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tool.description}</p>
      
      <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        Open Tool <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
      </div>
    </div>
  );
};

export default ToolCard;
