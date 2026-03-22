'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { ChatMessage } from '@/lib/claude';

interface ChatInterfaceProps {
  onInvoiceGenerated: (invoiceData: any) => void;
  isLoading?: boolean;
}

export default function ChatInterface({ onInvoiceGenerated, isLoading = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'll help you create a professional invoice in seconds.\n\nJust describe your work, like:\n• \"20 hours web dev for ABC Company at $100/hour\"\n• \"Logo design, $500 flat fee\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userContext: {
            currency: 'USD',
            country: 'US',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const data = await response.json();

      if (data.success && data.invoice) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `Perfect! I've generated your invoice for **${data.invoice.customer.name}**.\n\n💰 Total: $${data.invoice.total.toFixed(2)}\n\nYou can review and edit it on the right, then download as PDF.`,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        onInvoiceGenerated(data.invoice);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I had trouble generating that invoice. Could you provide more details about the work, hours, and rate?',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[rgb(17,17,17)] border border-[rgba(96,96,104,0.2)] rounded-[10px] overflow-hidden shadow-2xl relative">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[rgb(26,26,26)] border-b border-[rgba(96,96,104,0.2)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-bold text-[rgb(163,163,163)] uppercase tracking-widest">
          ai-invoice-terminal --prompt
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            {message.role === 'assistant' ? (
              <div className="flex-shrink-0 w-8 h-8 bg-[rgb(217,145,120)] rounded-[6px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[rgb(10,10,10)]" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 bg-[rgb(38,38,38)] rounded-[6px] flex items-center justify-center border border-[rgba(96,96,104,0.2)]">
                <User className="w-4 h-4 text-[rgb(163,163,163)]" />
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[85%] px-4 py-3 font-mono ${
                message.role === 'user'
                  ? 'bg-[rgb(217,145,120)] text-[rgb(10,10,10)] rounded-[8px]'
                  : 'bg-[rgb(26,26,26)] text-[rgb(237,237,237)] rounded-[8px] border border-[rgba(96,96,104,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-[10px] opacity-70 font-bold uppercase tracking-tighter">
                {message.role === 'assistant' ? (
                  <><span>$</span> ai-assistant</>
                ) : (
                  <><span>$</span> user-request</>
                )}
              </div>
              <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {(isGenerating || isLoading) && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[rgb(217,145,120)] rounded-[6px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[rgb(10,10,10)]" />
            </div>
            <div className="bg-[rgb(26,26,26)] px-4 py-3 rounded-[8px] border border-[rgba(96,96,104,0.2)]">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[rgb(217,145,120)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[rgb(217,145,120)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[rgb(217,145,120)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[rgba(96,96,104,0.1)] bg-[rgb(12,12,12)]">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe work... (cmd+enter to send)"
              className="w-full px-4 py-3 bg-[rgb(10,10,10)] border border-[rgba(96,96,104,0.2)] rounded-[8px] resize-none focus:outline-none focus:ring-1 focus:ring-[rgb(217,145,120)] focus:border-transparent text-xs font-mono text-[rgb(237,237,237)] placeholder:text-[rgb(163,163,163)]"
              rows={2}
              disabled={isGenerating || isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating || isLoading}
            className="px-4 py-3 bg-[rgb(217,145,120)] text-[rgb(10,10,10)] rounded-[8px] hover:bg-[rgb(230,160,135)] disabled:bg-[rgb(38,38,38)] disabled:text-[rgb(163,163,163)] disabled:cursor-not-allowed transition-all flex items-center justify-center h-[52px] w-[52px] flex-shrink-0 glow-accent shadow-lg"
          >
            {isGenerating || isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-[rgb(163,163,163)] mt-2 text-center font-mono opacity-50 uppercase tracking-widest">
          ai --parser --active
        </p>
      </div>
    </div>
  );
}
