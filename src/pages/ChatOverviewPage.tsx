import React, { useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sampleChats, Chat } from "@/models/chat";
import BottomNavBar from "@/components/BottomNavBar";
import { cn } from "@/lib/utils";

const ChatOverviewPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(sampleChats);
  const navigate = useNavigate();

  const activeChats = chats.filter((chat) => chat.status === "active");
  const inactiveChats = chats.filter((chat) => chat.status === "inactive");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Chat</h1>
        </div>
      </div>

      {/* Chat Lists */}
      <div className="px-4 py-4">
        {/* Active Chats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Active Chats
          </h2>
          <div className="space-y-3">
            {activeChats.map((chat) => (
              <div
                key={chat.id}
                className="bg-white rounded-lg shadow-sm p-3 flex items-center cursor-pointer"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mr-3">
                  {chat.participants[0].avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {chat.participants[0].name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {chat.lastMessage}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {chat.lastMessageTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inactive Chats */}
        {inactiveChats.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Inactive Chats
            </h2>
            <div className="space-y-3">
              {inactiveChats.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white rounded-lg shadow-sm p-3 flex items-center cursor-pointer opacity-75"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mr-3">
                    {chat.participants[0].avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {chat.participants[0].name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {chat.lastMessageTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Another Chat Button */}
      <div className="fixed bottom-24 right-4">
        <button
          onClick={() => navigate("/chat/new")}
          className="bg-school-primary text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default ChatOverviewPage;
