import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Smile,
  MapPin,
  Clock,
  DollarSign,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface QuickReply {
  label: string;
  message: string;
  icon: React.ReactNode;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    label: "Find Parking",
    message: "How can I find available parking near me?",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    label: "Pricing",
    message: "What are your parking rates?",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    label: "How it Works",
    message: "How does SmartPark work?",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    label: "Booking",
    message: "How do I book a parking spot?",
    icon: <Clock className="w-4 h-4" />,
  },
];

const BOT_RESPONSES: Record<string, string> = {
  "find parking": `I can help you find parking! 🚗 Here's how:
1. Click "Find Parking" on the home page
2. Select your desired date and time
3. Choose your preferred duration
4. Browse available parking locations
5. Select a spot and confirm your booking

Would you like me to guide you through the booking process?`,

  "parking rates":
    "Our parking rates vary by location:\n• Downtown Parking: ₹50.00/hour\n• Central Plaza: ₹40.00/hour\n• Mall Parking: ₹30.00/hour\n\nAll rates include real-time availability tracking and secure payment options. Would you like to know more about any specific location?",

  "how does smartpark work":
    "SmartPark uses advanced AI and IoT sensors to:\n✓ Detect available parking spaces in real-time\n✓ Show you live availability on our map\n✓ Allow instant booking and payment\n✓ Provide navigation to your spot\n✓ Send you parking reminders\n\nOur system reduces parking time by up to 30 minutes! Want to try it now?",

  "how do i book": `Booking is easy! 📍\n1. Sign in to your account\n2. Go to "Find Parking"\n3. Select date, time, and duration\n4. Choose your preferred location\n5. Review the booking summary\n6. Click "Book Parking"\n7. Complete payment\n\nYou'll receive a confirmation with your parking details!`,

  default: `Hello! 👋 I'm your SmartPark assistant. I can help you with:
• Finding available parking spots
• Booking and payment information
• How to use our platform
• Pricing and rates
• General inquiries

What can I help you with today?`,
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: BOT_RESPONSES.default,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response;
      }
    }

    // Check for partial matches
    if (
      lowerMessage.includes("parking") ||
      lowerMessage.includes("spot") ||
      lowerMessage.includes("book")
    ) {
      return BOT_RESPONSES["how do i book"];
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("rate")
    ) {
      return BOT_RESPONSES["parking rates"];
    }

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("what")
    ) {
      return BOT_RESPONSES["how does smartpark work"];
    }

    return `Thanks for your message! 😊 I'm here to help with parking-related questions. Could you tell me more about what you need? I can help with:\n• Finding parking\n• Booking information\n• Pricing details\n• How to use SmartPark`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickReply = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(message),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">SmartPark Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-200 text-slate-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-slate-600"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-900 px-4 py-2.5 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-3 border-t border-slate-200 bg-white">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Quick replies:
              </p>
              <div className="space-y-2">
                {QUICK_REPLIES.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.message)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-all flex items-center gap-2"
                  >
                    {reply.icon}
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
