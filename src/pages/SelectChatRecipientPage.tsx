import React, { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sampleUsers, ChatUser } from "@/models/chat";
import { Input } from "@/components/ui/input";
import BottomNavBar from "@/components/BottomNavBar";

const SelectChatRecipientPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>(sampleUsers);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(sampleUsers);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const results = sampleUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          (user.role && user.role.toLowerCase().includes(lowerQuery)) ||
          (user.classInfo && user.classInfo.toLowerCase().includes(lowerQuery))
      );
      setFilteredUsers(results);
    }
  }, [searchQuery]);

  const startChat = (userId: number) => {
    // In a real app, you'd check if a chat already exists and navigate to it
    // Otherwise create a new chat and navigate to it
    navigate(`/chat/new/${userId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex items-center">
        <Link to="/chat" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Chat</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-white"
            placeholder="Enter Name or User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="px-4 space-y-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-sm p-3 flex items-center cursor-pointer"
            onClick={() => startChat(user.id)}
          >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mr-3">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                {user.status === "active" && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {user.role}
                {user.classInfo && ` - ${user.classInfo}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default SelectChatRecipientPage;
