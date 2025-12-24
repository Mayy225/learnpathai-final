import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('Envoi de la question au webhook:', inputText);
      
      const response = await fetch('https://hook.eu2.make.com/8morq40nbhsb2xtwyvadit1wpn8g63sh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputText })
      });

      console.log('Status de la réponse:', response.status);
      console.log('Headers de la réponse:', response.headers);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer le texte brut d'abord
      const responseText = await response.text();
      console.log('Réponse brute du webhook:', responseText);
      
      // Essayer de parser en JSON
      let aiResponseText = 'Désolé, je n\'ai pas pu générer une réponse.';
      
      try {
        const data = JSON.parse(responseText);
        console.log('Réponse parsée:', data);
        
        // Extraire la réponse de différentes manières possibles
        if (typeof data === 'string') {
          aiResponseText = data;
        } else if (data && typeof data === 'object') {
          aiResponseText = data.response || data.answer || data.message || data.text || data.reply || data.result || data.output || responseText;
        }
      } catch (parseError) {
        // Si ce n'est pas du JSON, utiliser le texte brut
        console.log('La réponse n\'est pas du JSON, utilisation du texte brut');
        aiResponseText = responseText || 'Réponse vide du webhook';
      }
      
      console.log('Texte final de la réponse IA:', aiResponseText);
      
      // Nettoyage simple pour retirer d'éventuels guillemets/accents au début/fin
      aiResponseText = aiResponseText.trim().replace(/^[[\"'`]+|[\"'`]+$/g, '');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'IA. Veuillez réessayer.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatbot-history');
    toast({
      title: "Historique effacé",
      description: "Toutes les conversations ont été supprimées.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink hover:scale-110 transition-all duration-300 z-50 animate-float"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-text-dark" />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="right" 
          className="w-full sm:w-[400px] md:w-[500px] p-0 flex flex-col bg-gradient-to-br from-warm-yellow/20 via-warm-orange/20 to-warm-pink/20"
        >
          <SheetHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearHistory}
                className="h-9 w-9 hover:bg-white/20 transition-colors"
                title="Effacer la discussion"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <SheetTitle className="text-text-dark text-lg sm:text-xl font-bold">Assistant IA</SheetTitle>
              
              <div className="w-9" />
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4 sm:p-6">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Posez-moi une question !</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-warm-orange to-warm-pink text-text-dark'
                        : 'bg-white/80 backdrop-blur-sm text-text-dark border border-warm-orange/20'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        <ReactMarkdown
                          components={{
                            h1: (props: any) => <h1 className="text-lg font-bold bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink bg-clip-text text-transparent mb-2" {...props} />,
                            h2: (props: any) => <h2 className="text-base font-semibold text-warm-orange mb-1" {...props} />,
                            h3: (props: any) => <h3 className="font-medium text-warm-pink mb-1" {...props} />,
                            p: (props: any) => <p className="text-text-dark mb-2" {...props} />,
                            ul: (props: any) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                            ol: (props: any) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                            li: (props: any) => <li className="text-text-dark" {...props} />,
                            a: (props: any) => <a className="underline text-warm-pink hover:text-warm-orange transition-colors" target="_blank" rel="noreferrer" {...props} />,
                            strong: (props: any) => <strong className="text-warm-orange" {...props} />,
                            em: (props: any) => <em className="text-warm-pink" {...props} />,
                            code: (props: any) => <code className="bg-warm-yellow/20 rounded px-1 py-0.5" {...props} />,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-warm-orange/20">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-warm-orange rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-warm-orange rounded-full animate-pulse animation-delay-150"></span>
                      <span className="w-2 h-2 bg-warm-orange rounded-full animate-pulse animation-delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 sm:p-6 border-t bg-white/50 backdrop-blur-sm">
            <div className="flex gap-2 sm:gap-3">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="resize-none min-h-[60px] sm:min-h-[70px] bg-white/80 border-warm-orange/30 focus:border-warm-orange text-sm sm:text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink hover:opacity-90 text-text-dark h-[60px] sm:h-[70px] px-4 sm:px-6 shrink-0"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatBot;
