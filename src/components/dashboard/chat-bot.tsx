
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { knowledgeBase } from '@/lib/knowledge-base';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'আসসালামু আলাইকুম! আমি DocX অ্যাসিস্ট্যান্ট। আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const findAnswer = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // exact match check
    const entry = knowledgeBase.find(e => 
      e.keywords.some(k => lowerQuery.includes(k.toLowerCase()))
    );

    if (entry) return entry.answer;
    
    return "দুঃখিত, আমি এই বিষয়ে বিস্তারিত জানি না। দয়া করে ইতিহাস, কমিটি বা FAQ বিভাগগুলো চেক করুন অথবা নির্দিষ্ট কীওয়ার্ড (যেমন: সভাপতি, ভর্তি, নিয়ম) লিখে সার্চ করুন।";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      const botResponse = findAnswer(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    setInput(option);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl animate-in zoom-in duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[320px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300 border-primary/20">
          <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg font-bold">DocX অ্যাসিস্ট্যান্ট</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-muted/5">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/20' : 'bg-muted border'}`}>
                        {m.role === 'user' ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-white border rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {messages.length === 1 && (
              <div className="p-4 flex flex-wrap gap-2 pt-0">
                {['আমাদের ইতিহাস', 'কমিটি', 'গঠনতন্ত্র', 'সদস্যপদ'].map(opt => (
                  <Button 
                    key={opt} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 rounded-full bg-white hover:bg-primary/10 border-primary/20"
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            <div className="p-4 border-t bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  placeholder="আপনার প্রশ্ন লিখুন..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-muted/30 border-none focus-visible:ring-1"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
