import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Droplets,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { ChatMessage } from '../../types';

export const AiChatAssistant: React.FC = () => {
  const { tanks, settings, recommendations, suppliers, forecast } = useWater();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const underground = tanks.find((t) => t.id === 'tank-underground') || tanks[0];
  const overhead = tanks.find((t) => t.id === 'tank-overhead') || tanks[1];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello Ravi! I'm your JalGuard AI operations co-pilot for ${settings.propertyName}. Underground storage is at ${underground.currentLiters.toLocaleString()} L (63%). How can I assist with water planning today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const suggestedQuestions = [
    'Will we have enough water for the weekend?',
    'Why is shortage risk high?',
    'What should I order today?',
    'Which supplier should I use?',
    'What happens if municipal supply stops tomorrow?',
    'How much water did we waste this month?',
  ];

  // Domain-specific realistic intelligence engine for Green Valley Apartments
  const generateDomainResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) {
      return `Based on current tank levels (${underground.currentLiters.toLocaleString()} L) and our 7-day consumption forecast, your property is projected to fall below the ${settings.minimumSafetyReserveLiters.toLocaleString()} L safety reserve on Saturday afternoon due to a predicted +17% weekend laundry demand surge (96,000 L on Sunday). I strongly recommend arranging at least one 12,000 L tanker by Saturday morning.`;
    }

    if (q.includes('why') && (q.includes('risk') || q.includes('shortage') || q.includes('high'))) {
      return `Shortage risk is rated HIGH because: 1) BWSSB municipal feeder line pressure is running 18% below schedule, creating a ~16,000 L inflow deficit; 2) Daily consumption is tracking at 81,000 L (+2.1% above baseline); 3) At the current net drain rate of 1,050 L/hr, our reserve will be breached Thursday around 6:00 AM without external procurement.`;
    }

    if (q.includes('order') || q.includes('procure') || q.includes('what should i')) {
      return `For today (Wednesday), JalGuard AI recommends booking one 12,000 L utility water tanker from AquaFlow Tankers for delivery between 6:00 AM – 8:00 AM tomorrow (Est. ₹1,800). This will safely buffer our sump to 106,000 L ahead of Thursday morning peak draw.`;
    }

    if (q.includes('supplier') || q.includes('vendor') || q.includes('who to')) {
      return `I recommend AquaFlow Tankers (₹1,800 / 12,000 L). Although AquaFlow costs ₹150 more than CityWater Services, their 94% on-time rate and 45-minute average turnaround provide the highest reliability to protect ${settings.propertyName} during high-demand slots.`;
    }

    if (q.includes('municipal') && (q.includes('stop') || q.includes('unavailable') || q.includes('shut') || q.includes('cut'))) {
      return `If BWSSB municipal supply stops completely for 24 hours, our 24h inflow drops to 24,000 L (borewells only). Against 84,000 L expected consumption, storage would drop by 60,000 L down to 34,000 L, coming within 14,000 L of our safety reserve. We would need two 12,000 L tankers (24,000 L total, ~₹3,600) to remain fully safe.`;
    }

    if (q.includes('waste') || q.includes('leak') || q.includes('loss')) {
      return `Through JalGuard AI's automated overhead pump staging and nocturnal acoustic leak detection, Green Valley has reduced water wastage by 18.5% this month, saving an estimated 142,000 Litres and avoiding roughly ₹21,000 in unnecessary pumping energy and water loss.`;
    }

    // Default intelligent operational answer
    return `According to live telemetry for ${settings.propertyName}: Underground sump holds ${underground.currentLiters.toLocaleString()} L (${underground.percentage}%), overhead tank holds ${overhead.currentLiters.toLocaleString()} L (${overhead.percentage}%), with 1.8 days of supply remaining. Daily baseline is 82,000 L across 200 apartments. Please let me know if you'd like a procurement schedule or What-If stress test!`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateDomainResponse(text);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xl shadow-sky-600/30 hover:scale-105 transition-all flex items-center gap-2 group ${
          isOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">Ask JalGuard AI</span>
      </button>

      {/* Slide-in Chat Drawer / Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Ask JalGuard AI</h3>
                <p className="text-[11px] text-sky-100">Green Valley Water Co-pilot · Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Context Bar */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
            <span>Sump: <strong className="text-slate-800">{underground.currentLiters.toLocaleString()} L</strong></span>
            <span>·</span>
            <span>Risk: <strong className="text-rose-600 font-bold">HIGH</strong></span>
            <span>·</span>
            <span>Remaining: <strong className="text-slate-800">1.8 Days</strong></span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isAssistant
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-900 text-white font-bold text-[10px]'
                    }`}
                  >
                    {isAssistant ? <Sparkles className="w-4 h-4" /> : 'RK'}
                  </div>

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-100 text-slate-800 rounded-tl-xs'
                        : 'bg-sky-600 text-white rounded-tr-xs font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isAssistant ? 'text-slate-400' : 'text-sky-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">JalGuard is calculating telemetry...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Section */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700 text-[11px] font-medium transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about water shortage, tankers, forecasts..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
