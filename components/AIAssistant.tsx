
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const assistantIcon = "https://firebasestorage.googleapis.com/v0/b/team-galaxy-90x.appspot.com/o/data%2F176657.png?alt=media&token=9d15e351-0c27-4c2e-852b-6633dfa2053c";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setIsTyping(true);

    try {
      const response = await chatWithAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || "System unavailable. Try again shortly." }] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Network error. Please verify your connection." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-[360px] md:w-[420px] h-[600px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-up">
          <div className="bg-blue-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src={assistantIcon} className="w-full h-full object-cover" alt="AI" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight">AI Assistant</h4>
                <p className="text-blue-100 text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> SYSTEM ACTIVE
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950/50">
            {messages.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <img src={assistantIcon} className="w-20 h-20 mx-auto opacity-30 grayscale" alt="Start" />
                <p className="text-slate-400 font-bold px-10">How can I assist you with EasyTools today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl font-medium text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xl shadow-blue-100 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-md border border-slate-100 dark:border-slate-700'
                }`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-bl-none shadow-md border border-slate-100 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <input 
                className="w-full pl-6 pr-14 py-4 bg-slate-100 dark:bg-slate-950 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
                placeholder="Type your inquiry..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2.5 top-2.5 w-11 h-11 bg-blue-600 text-white rounded-[1.25rem] flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-blue-600 rounded-[2rem] shadow-[0_15px_40px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all overflow-hidden border-4 border-white dark:border-slate-900"
        >
          <img src={assistantIcon} className="w-12 h-12 object-contain" alt="Assistant" />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
