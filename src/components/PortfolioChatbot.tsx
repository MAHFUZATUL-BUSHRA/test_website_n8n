import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { AlertCircle, ArrowUp, MessageSquare, RotateCcw, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface PortfolioChatbotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const STARTER_QUESTIONS = [
  'What distributed systems has Clara built?',
  'Summarize her Rust and TypeScript experience.',
  'Is Clara open to Staff+ roles or advisory?',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Hello! I'm Clara Vance's portfolio assistant. Ask me anything about her distributed systems projects, technical stack, engineering experience, or availability.",
};

export function PortfolioChatbot({ isOpen, onOpen, onClose }: PortfolioChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorText, setErrorText] = useState('');
  const endOfListRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed || isStreaming) return;

    setErrorText('');
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const assistantId = `assistant_${Date.now() + 1}`;
    const nextHistory = [...messages, userMessage];

    setMessages([...nextHistory, { id: assistantId, role: 'assistant', text: '' }]);
    setInput('');
    setIsStreaming(true);

    try {
      const apiMessages = nextHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload.error || 'Assistant request failed. Please try again.');
      }

      if (!contentType.includes('text/event-stream')) {
        const payload = await response.json().catch(() => ({}));
        const replyText =
          typeof payload.reply === 'string' && payload.reply.trim()
            ? payload.reply.trim()
            : '';
        if (!replyText) {
          throw new Error('No reply received from webhook.');
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: replyText } : m))
        );
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming response unavailable.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;

          const parsed = JSON.parse(line.slice(6));
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.delta) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: m.text + parsed.delta } : m
              )
            );
          }
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to reach assistant right now.';
      setErrorText(message);
      setMessages((prev) => prev.filter((m) => !(m.id === assistantId && m.text === '')));
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function handleReset() {
    if (isStreaming) return;
    setMessages([INITIAL_MESSAGE]);
    setErrorText('');
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open portfolio assistant chat"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-white bg-[#0A0B0D] hover:bg-[#2563EB] rounded-xl shadow-lg border border-zinc-800/20 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Portfolio Chat</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
          onClick={onClose}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Clara Vance Portfolio Assistant"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col"
          >
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <h2 className="font-display text-base font-bold text-[#0A0B0D] truncate">
                  Portfolio Assistant
                </h2>
                <p className="text-xs text-zinc-500 truncate">
                  Ask about Clara&apos;s projects, architecture, and skills
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isStreaming}
                  aria-label="Reset conversation"
                  title="Reset conversation"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 hover:text-[#0A0B0D] hover:bg-zinc-100 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close portfolio assistant"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 hover:text-[#0A0B0D] hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#FAFAFA]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#0A0B0D] text-white'
                          : 'bg-white border border-zinc-200 text-[#0A0B0D]'
                      }`}
                    >
                      {msg.text || (isStreaming ? 'Thinking...' : '')}
                    </div>
                  </div>
                );
              })}

              {messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-medium text-zinc-500">Suggested questions</p>
                  <div className="flex flex-col items-start gap-2">
                    {STARTER_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="text-left text-xs font-medium text-[#0A0B0D] bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {errorText && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorText}</span>
                </div>
              )}

              <div ref={endOfListRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white border-t border-zinc-200 shrink-0"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, skills, or roles..."
                  aria-label="Message for portfolio assistant"
                  className="flex-1 min-h-[42px] max-h-28 px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-xl text-[#0A0B0D] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 resize-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="inline-flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-zinc-300 text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
