import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI learning assistant. I can summarize documents, explain complex concepts, or quiz you on the material. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'ai', text: 'Based on the context, this is a simulated response formatted exactly how Google Gemini would explain a complex topic, using clear bullet points and bold text to help structure knowledge efficiently.' }
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-white">
         <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mr-3">
           <Sparkles size={20} />
         </div>
         <div>
           <h3 className="font-bold text-gray-900 text-sm">AI Study Assistant</h3>
           <p className="text-xs text-emerald-600 font-medium">Document Context Active</p>
         </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-600 ml-3' : 'bg-gradient-to-br from-indigo-500 to-purple-600 mr-3 shadow-sm'}`}>
              {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`p-4 text-[15px] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex max-w-[85%] animate-in fade-in duration-300">
             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-sm">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center justify-center h-12 w-16">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center tracking-wide">
          <Sparkles size={12} className="mr-1.5" />
          AI responses can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
