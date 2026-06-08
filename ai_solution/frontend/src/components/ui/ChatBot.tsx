'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm the AI-Solution assistant. How can I help you today? I can answer questions about our services, demos, or events. 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      const response = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      const reply = data.reply || "I'm sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or visit our contact page.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 ${
            minimized ? 'h-14' : 'h-[500px]'
          }`}
          style={{ border: '1px solid rgba(0,229,255,0.2)', background: '#0d1b2e' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-brand-900 to-dark-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center animate-pulse-slow">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>AI Assistant</p>
                <p className="text-xs text-[var(--text-muted)]">AI-Solution Support</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMinimized(!minimized)} className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ background: '#060d1a' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mr-2 mt-1">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="chat-bubble-ai flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-accent" />
                      <span className="text-sm text-[var(--text-muted)]">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[var(--border)] flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="input-field text-sm py-2"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="btn-primary py-2 px-3 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-accent/50 animate-glow"
        aria-label="Open AI Chat"
      >
        {open ? <X size={22} /> : (
          <svg viewBox="0 0 24 24" fill="none" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="13" rx="3" stroke="white" strokeWidth="1.8" fill="none"/>
            <circle cx="9" cy="13" r="1.5" fill="white"/>
            <circle cx="15" cy="13" r="1.5" fill="white"/>
            <path d="M9 17h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M12 7V4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="3" r="1" fill="white"/>
            <path d="M3 13H1M23 13H21" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[var(--bg)]" />
        )}
      </button>
    </>
  );
}
