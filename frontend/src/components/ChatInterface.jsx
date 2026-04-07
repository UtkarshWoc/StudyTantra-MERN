import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatInterface = ({ documentId, documentTitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!documentId || !user) return;

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/${documentId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (data.history && data.history.length > 0) {
          const formattedHistory = data.history.map((msg, i) => ({
            id: i,
            sender: msg.role === 'model' ? 'ai' : 'user',
            text: msg.content
          }));
          setMessages(formattedHistory);
        } else {
          setMessages([{
            id: 'welcome',
            sender: 'ai',
            text: `Hello! I am your AI learning assistant. I have analyzed the document "${documentTitle || 'your document'}". What would you like to know?`
          }]);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [documentId, user, documentTitle]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !documentId) return;

    const userText = input;
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/${documentId}`,
        { message: userText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: data.reply }
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Error: Could not connect to the AI service. Please try again.' }
      ]);
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-400">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading AI context...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden font-sans transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Study Assistant</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Document Context Active</p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-600 ml-3' : 'bg-gradient-to-br from-indigo-500 to-purple-600 mr-3 shadow-sm'}`}>
              {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`p-4 text-[15px] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed'} whitespace-pre-wrap transition-colors`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex max-w-[85%] animate-in fade-in duration-300">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-sm">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center justify-center h-12 w-16 transition-colors">
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
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 transition-colors">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 text-gray-900 dark:text-gray-100 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
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
