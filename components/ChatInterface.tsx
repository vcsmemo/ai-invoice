'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { ChatMessage } from '@/lib/claude';

interface ChatInterfaceProps {
  onInvoiceGenerated: (invoiceData: any) => void;
  isLoading?: boolean;
  initialCurrency?: string;
  initialCountry?: string;
}

export default function ChatInterface({ 
  onInvoiceGenerated, 
  isLoading = false,
  initialCurrency = 'USD',
  initialCountry = 'US'
}: ChatInterfaceProps) {
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
            currency: initialCurrency,
            country: initialCountry,
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
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-[10px] overflow-hidden shadow-2xl relative">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-[6px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-[6px] flex items-center justify-center border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[85%] px-4 py-3 font-mono ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-[8px]'
                  : 'bg-muted/50 text-foreground rounded-[8px] border border-border'
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
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-[6px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted/50 px-4 py-3 rounded-[8px] border border-border">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe work... (cmd+enter to send)"
              className="w-full px-4 py-3 bg-background border border-border rounded-[8px] resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs font-mono text-foreground placeholder:text-muted-foreground"
              rows={2}
              disabled={isGenerating || isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating || isLoading}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-[8px] hover:opacity-90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed transition-all flex items-center justify-center h-[52px] w-[52px] flex-shrink-0 glow-accent shadow-lg"
          >
            {isGenerating || isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono opacity-50 uppercase tracking-widest">
          ai --parser --active
        </p>
      </div>
    </div>
  );
}
