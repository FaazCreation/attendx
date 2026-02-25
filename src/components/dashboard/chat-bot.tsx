'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, User, Bot, Sparkles, Mail, Facebook } from 'lucide-react';
import { knowledgeBase } from '@/lib/knowledge-base';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isCustom?: boolean;
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
    const lowerQuery = query.toLowerCase().trim();
    
    // exact keyword match check with better fuzzy logic
    const entry = knowledgeBase.find(e => 
      e.keywords.some(k => lowerQuery.includes(k.toLowerCase()))
    );

    if (entry) return entry.answer;
    
    return "NOT_FOUND";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      const botResponse = findAnswer(userMessage);
      if (botResponse === "NOT_FOUND") {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "দুঃখিত, আমি এই বিষয়ে সঠিক তথ্য খুঁজে পাইনি। আপনার প্রশ্নের উত্তর আমাদের ডাটাবেসে নেই। আরও বিস্তারিত আলোচনার জন্য অনুগ্রহ করে আমাদের অফিসিয়াল ইমেইল (tcd.photographyclub@gmail.com) অথবা ফেসবুক পেজে যোগাযোগ করুন। আমরা দ্রুতই আপনার সাথে যোগাযোগ করার চেষ্টা করবো।",
          isCustom: true
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      }
    }, 600);
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
        <Card className="w-[320px] sm:w-[380px] h-[520px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300 border-primary/20 overflow-hidden">
          <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">DocX অ্যাসিস্ট্যান্ট</CardTitle>
                <p className="text-[10px] opacity-80 font-headline">Always here to help</p>
              </div>
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
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-primary/10' : 'bg-white border'}`}>
                        {m.role === 'user' ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                          m.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-white border rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        {m.isCustom && (
                          <div className="flex gap-2 mt-2">
                            <a href="mailto:tcd.photographyclub@gmail.com" className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors">
                              <Mail className="h-3 w-3" /> Email
                            </a>
                            <a href="https://facebook.com/tcd.photographyclub" target="_blank" className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
                              <Facebook className="h-3 w-3" /> Facebook
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-3 bg-white border-t space-y-3">
              {messages.length < 5 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {['কমিটি', 'গঠনতন্ত্র', 'নিয়োগ', 'ফি'].map(opt => (
                    <Button 
                      key={opt} 
                      variant="outline" 
                      size="sm" 
                      className="text-[11px] h-7 rounded-full bg-white hover:bg-primary/10 border-primary/20 transition-all"
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
              
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  placeholder="আপনার প্রশ্ন লিখুন..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-muted/30 border-none focus-visible:ring-1 text-sm h-10"
                />
                <Button type="submit" size="icon" className="shrink-0 h-10 w-10">
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