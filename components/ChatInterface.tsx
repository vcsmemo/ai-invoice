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
    <div className="flex flex-col h-full bg-[rgb(16,16,16)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            {message.role === 'assistant' ? (
              <div className="flex-shrink-0 w-8 h-8 bg-[rgb(200,245,66)] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-[rgb(8,8,8)]" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 bg-[rgb(24,24,24)] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)]">
                <User className="w-4 h-4 text-[rgb(180,180,180)]" />
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[80%] px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-2xl rounded-tr-sm'
                  : 'bg-[rgb(24,24,24)] text-[rgb(250,250,250)] rounded-2xl rounded-tl-sm border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {(isGenerating || isLoading) && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[rgb(200,245,66)] rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-[rgb(8,8,8)]" />
            </div>
            <div className="bg-[rgb(24,24,24)] px-4 py-3 rounded-2xl rounded-tl-sm border border-[rgba(255,255,255,0.08)]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[rgb(200,245,66)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[rgb(200,245,66)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[rgb(200,245,66)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-[rgba(255,255,255,0.08)] bg-[rgb(12,12,12)]">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full px-4 py-3 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] focus:border-transparent text-sm text-[rgb(250,250,250)] placeholder:text-[rgb(120,120,120)]"
              rows={2}
              disabled={isGenerating || isLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-[rgb(120,120,120)]">
              Press Enter to send
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating || isLoading}
            className="px-4 py-3 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-xl hover:bg-[rgb(180,230,60)] disabled:bg-[rgb(40,40,40)] disabled:text-[rgb(80,80,80)] disabled:cursor-not-allowed transition-all flex items-center justify-center h-[66px] w-[66px] flex-shrink-0"
          >
            {isGenerating || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-[rgb(120,120,120)] mt-2 text-center">
          AI will extract customer info, items, and calculate totals automatically
        </p>
      </div>
    </div>
  );
}
