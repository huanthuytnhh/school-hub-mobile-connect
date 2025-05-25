import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Paperclip, Send, Smile } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { sampleChats, sampleUsers, ChatMessage } from "@/models/chat";
import BottomNavBar from "@/components/BottomNavBar";
import { cn } from "@/lib/utils";

const ChatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAvatar, setRecipientAvatar] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Current user ID (would come from authentication in a real app)
  const currentUserId = 0;

  useEffect(() => {
    // Load chat data based on ID
    const chatId = parseInt(id || "0", 10);
    const chat = sampleChats.find((c) => c.id === chatId);

    if (chat) {
      setMessages(chat.messages);
      setRecipientName(chat.participants[0].name);
      setRecipientAvatar(chat.participants[0].avatar);
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: parseInt(id || "0", 10),
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex items-center sticky top-0 z-10">
        <Link to="/chat" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xl mr-2">
            {recipientAvatar}
          </div>
          <h1 className="text-xl font-bold">{recipientName}</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              message.senderId === currentUserId
                ? "bg-school-primary text-white ml-auto rounded-tr-none"
                : "bg-white text-gray-800 rounded-tl-none"
            )}
          >
            <p>{message.content}</p>
            <span
              className={cn(
                "text-xs block mt-1",
                message.senderId === currentUserId
                  ? "text-blue-100"
                  : "text-gray-500"
              )}
            >
              {message.timestamp}
              {message.read && message.senderId === currentUserId && (
                <span className="ml-1">✓✓</span>
              )}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 border-t fixed bottom-16 left-0 right-0">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <button className="text-gray-500 mr-2">
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            className="flex-1 bg-transparent outline-none resize-none max-h-24"
            placeholder="Write here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <button className="text-gray-500 mx-2">
            <Smile className="h-5 w-5" />
          </button>
          <button
            className="text-white bg-school-primary p-2 rounded-full"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default ChatDetailPage;
