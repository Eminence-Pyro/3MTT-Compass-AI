"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2, X, Loader2, AlertCircle } from 'lucide-react';
import { User as AppUser } from '../../types/index';
import { apiService } from '../../services/apiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  error?: boolean;
}

interface ConversationalAIProps {
  user: AppUser;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ConversationalAI: React.FC<ConversationalAIProps> = ({ user, isOpen, onToggle, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user.name}! 👋 I'm Compass AI, your personal learning assistant for the 3MTT program.\n\nI know you're on the **${user.track || 'your selected'}** track. Ask me anything — study tips, concept explanations, next steps, or just how to stay motivated. I'm here to help!`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage]   = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [isMinimized, setIsMinimized]     = useState(false);
  const messagesEndRef                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getHistory = () =>
    messages
      .filter(m => m.id !== 'welcome' && !m.error)
      .map(m => ({ role: m.role, content: m.content }));

  const handleSend = async () => {
    const text = inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await apiService.aiChat(text, getHistory());
      setMessages(prev => [...prev, {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        error: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Quick prompt chips
  const quickPrompts = [
    'What should I study next?',
    `Explain a key concept in ${user.track || 'my track'}`,
    'How do I stay motivated?',
    'Tips for completing modules faster',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Open Compass AI"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[560px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-600 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Compass AI</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              <span className="text-green-200 text-xs">Powered by Groq Llama 3.3</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 text-white hover:bg-white/20" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {msg.error ? <AlertCircle className="h-4 w-4 text-red-500" /> : <Bot className="h-4 w-4 text-green-600" />}
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : msg.error
                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-gray-500 text-sm">Compass AI is thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick prompts — only show if 1 message (welcome only) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {quickPrompts.map(p => (
                <button key={p}
                  onClick={() => { setInputMessage(p); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
            <Input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Compass AI anything…"
              disabled={isLoading}
              className="flex-1 text-sm rounded-xl border-gray-200"
            />
            <Button onClick={handleSend} disabled={!inputMessage.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 rounded-xl px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationalAI;
