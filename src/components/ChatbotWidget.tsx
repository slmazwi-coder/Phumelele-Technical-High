import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getApplications, type Application } from '../admin/utils/storage';

type ChatRole = 'user' | 'bot';
type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
};

const QUICK_QUESTIONS = [
  'How do I apply for admission?',
  'What technical streams are offered?',
  'What documents do I need?',
  'What are the school hours?',
];

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function formatDate(iso: string | undefined) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}

type StatusQuery =
  | { kind: 'studentNumber'; studentNumber: string }
  | { kind: 'nameAndDob'; firstName: string; lastName: string; dob: string };

function parseStatusQuery(input: string): StatusQuery | null {
  const text = normalize(input);
  const snMatch = text.match(/(student number|student no|student|status)\s*[:#]?\s*([a-z0-9-]{6,})/i);
  if (snMatch?.[2]) return { kind: 'studentNumber', studentNumber: snMatch[2].toUpperCase() };
  const dobMatch = text.match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
  if (dobMatch) {
    const dob = dobMatch[0];
    const namePart = text.replace(dob, ' ').replace(/\b(dob|date of birth)\b/g, ' ');
    const tokens = namePart.split(/\s+/).filter(Boolean);
    const statusIdx = tokens.findIndex((t) => t === 'status');
    const startIdx = statusIdx >= 0 ? statusIdx + 1 : 0;
    const firstName = tokens[startIdx];
    const lastName = tokens[startIdx + 1];
    if (firstName && lastName) return { kind: 'nameAndDob', firstName, lastName, dob };
  }
  return null;
}

function findApplication(apps: Application[], q: StatusQuery) {
  if (q.kind === 'studentNumber') {
    return apps.find((a) => normalize(a.studentNumber) === normalize(q.studentNumber));
  }
  return apps.find((a) =>
    normalize(a.firstName) === normalize(q.firstName) &&
    normalize(a.lastName) === normalize(q.lastName) &&
    normalize(a.dob) === normalize(q.dob)
  );
}

const SYSTEM_PROMPT = `You are a warm, knowledgeable and friendly assistant for Phumelele Technical High School in Matatiele, Eastern Cape, South Africa.

You help parents, learners, guardians and community members with anything about the school:
- Admissions and application process
- Required documents for applications
- Technical streams (Civil Technology, Electrical Technology, Mechanical Technology, Engineering Graphics & Design, Woodworking, Construction)
- School fees, payment and financial assistance
- School hours and term dates
- Staff, departments and contact information
- Academic results, achievements and activities
- Sports, culture and extra-curricular programs
- General encouragement and guidance for parents and learners

School details:
- Name: Phumelele Technical High School (Phumelele Comp Tech Senior Secondary School)
- Location: Embizeni, Lupindo A/A, Matatiele, Eastern Cape, 4730
- Phone: +27 72 715 0626 / +27 76 286 6884
- Email: kmohlafuno@gmail.com
- Principal: Mr. K Mohlafuno
- School hours: Monday–Thursday 07:30–15:30, Friday 07:30–13:30
- Grades: Grade 8 to Grade 12
- Technical Streams: Civil Technology, Electrical Technology, Mechanical Technology, EGD, Woodworking, Construction
- EMIS No: 200501431
- Alfred Nzo District Municipality

Be warm, clear and concise. Always encourage. If you are unsure about something very specific, direct them to call or email the school.`;

async function askGemini(userMessage: string): Promise<string> {
  try {
    const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';
    if (!apiKey) {
      return 'The chatbot is currently being set up. Please contact the school directly at +27 72 715 0626 or kmohlafuno@gmail.com.';
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1000,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Empty response');
    return text;
  } catch (err) {
    console.error('[Chatbot] Gemini request failed:', err);
    return 'I\'m having trouble connecting right now. Please contact the school directly at +27 72 715 0626 or kmohlafuno@gmail.com.';
  }
}

export function ChatbotWidget(props: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(props.defaultOpen));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'bot',
      createdAt: Date.now(),
      text: "Hello! Welcome to Phumelele Technical High School. Whether it's admissions, technical streams, fees, results or anything else — just ask and I'll be happy to assist.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const apps = useMemo(() => {
    try { return getApplications(); } catch { return []; }
  }, [open]);

  const showQuickQuestions = messages.length <= 1 && !isTyping;

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: uid(), role: 'user', text, createdAt: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const statusQ = parseStatusQuery(text);
      if (statusQ) {
        const app = findApplication(apps, statusQ);
        const replyText = app
          ? `I found the application for ${app.firstName} ${app.lastName} (Student number: ${app.studentNumber}). Status: ${app.status}.${app.submittedDate ? ` Submitted: ${formatDate(app.submittedDate)}.` : ''}`
          : 'I could not find a matching application. Please double-check the student number or learner name and date of birth.';
        setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: replyText, createdAt: Date.now() }]);
        setIsTyping(false);
        return;
      }

      const reply = await askGemini(text);
      setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: reply, createdAt: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'bot', text: 'Something went wrong. Please contact the school at +27 72 715 0626.', createdAt: Date.now() },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes pths-chat-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pths-chat-window { animation: pths-chat-in 0.2s cubic-bezier(0.34, 1.1, 0.64, 1) both; }
      `}</style>

      {open && (
        <div
          className="pths-chat-window fixed z-50
            bottom-[4.5rem] right-3
            sm:bottom-24 sm:right-6
            w-[calc(100vw-1.5rem)] max-w-[375px]
            h-[min(70vh,560px)]
            bg-white rounded-2xl shadow-2xl border border-gray-200
            flex flex-col overflow-hidden"
          role="dialog"
          aria-label="School help desk chatbot"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-school-navy text-white shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm leading-tight truncate">PTHS Assistant</div>
                <div className="flex items-center gap-1 text-[11px] text-white/70 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                  Online · AI-powered
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50 scroll-smooth">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-1.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {m.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-school-navy flex items-center justify-center shrink-0 mb-0.5">
                    <Sparkles size={11} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-school-navy text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-6 rounded-full bg-school-navy flex items-center justify-center shrink-0">
                  <Sparkles size={11} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {showQuickQuestions && (
              <div className="pt-1">
                <p className="text-[11px] text-gray-400 text-center mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-school-navy/25 text-school-navy hover:bg-school-gold hover:text-school-navy transition-colors font-medium shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-school-gold/20 focus:border-school-navy/40 transition-all bg-gray-50 placeholder:text-gray-400"
                placeholder="Ask me anything about the school..."
                aria-label="Chat input"
                disabled={isTyping}
              />
              <button
                onClick={() => send()}
                disabled={isTyping || !input.trim()}
                className="bg-school-navy hover:bg-blue-900 text-white px-3 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              AI-powered · Phumelele THS
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-4 right-3 sm:bottom-6 sm:right-6
          w-14 h-14 rounded-full shadow-xl
          bg-school-navy hover:bg-blue-900
          text-white flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        <div className="relative">
          {open ? (
            <X size={22} />
          ) : (
            <>
              <MessageCircle size={22} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </>
          )}
        </div>
      </button>
    </>
  );
}
