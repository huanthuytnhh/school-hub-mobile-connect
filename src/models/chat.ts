export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  role?: string;
  classInfo?: string;
  status?: "active" | "inactive";
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: number;
  participants: ChatUser[];
  lastMessage: string;
  lastMessageTime: string;
  status: "active" | "inactive";
  messages: ChatMessage[];
}

// Sample data
export const sampleUsers: ChatUser[] = [
  {
    id: 1,
    name: "Mr. Quang",
    avatar: "👨‍🏫",
    role: "Teacher",
    classInfo: "Class 5/1",
    status: "active",
  },
  {
    id: 2,
    name: "Ms. Hanh",
    avatar: "👩‍🏫",
    role: "Teacher",
    classInfo: "Class 3/2",
    status: "active",
  },
  {
    id: 3,
    name: "Support Assistant",
    avatar: "🧑‍💼",
    role: "Admin",
    status: "active",
  },
  {
    id: 4,
    name: "Mr. Tuan",
    avatar: "👨‍🏫",
    role: "Teacher",
    classInfo: "Class 4/3",
    status: "inactive",
  },
  {
    id: 5,
    name: "Principal Minh",
    avatar: "👨‍💼",
    role: "Admin",
    status: "active",
  },
];

export const sampleChats: Chat[] = [
  {
    id: 101,
    participants: [sampleUsers[0]], // Mr. Quang
    lastMessage: "How can I help you today?",
    lastMessageTime: "2 min ago",
    status: "active",
    messages: [
      {
        id: 1001,
        senderId: 1,
        receiverId: 0, // User's ID
        content: "Welcome. How can I help you today?",
        timestamp: "10:30 AM",
        read: true,
      },
      {
        id: 1002,
        senderId: 0, // User's ID
        receiverId: 1,
        content:
          "Hello! I have a question. How can I record my expenses by date?",
        timestamp: "10:32 AM",
        read: true,
      },
      {
        id: 1003,
        senderId: 1,
        receiverId: 0,
        content:
          "You can use the expense tracking feature under the profile section. Would you like me to show you how?",
        timestamp: "10:35 AM",
        read: true,
      },
    ],
  },
  {
    id: 102,
    participants: [sampleUsers[2]], // Support Assistant
    lastMessage: "Your request has been processed.",
    lastMessageTime: "1 hour ago",
    status: "active",
    messages: [
      {
        id: 2001,
        senderId: 3,
        receiverId: 0,
        content: "Hello, how can I assist you today?",
        timestamp: "9:15 AM",
        read: true,
      },
      {
        id: 2002,
        senderId: 0,
        receiverId: 3,
        content: "I need help with the application settings.",
        timestamp: "9:20 AM",
        read: true,
      },
      {
        id: 2003,
        senderId: 3,
        receiverId: 0,
        content:
          "Your request has been processed. Is there anything else I can help with?",
        timestamp: "9:45 AM",
        read: true,
      },
    ],
  },
  {
    id: 103,
    participants: [sampleUsers[4]], // Principal Minh
    lastMessage: "Meeting scheduled for tomorrow at 10 AM.",
    lastMessageTime: "Yesterday",
    status: "active",
    messages: [
      {
        id: 3001,
        senderId: 5,
        receiverId: 0,
        content: "We need to discuss the upcoming school event.",
        timestamp: "Yesterday, 3:30 PM",
        read: true,
      },
      {
        id: 3002,
        senderId: 0,
        receiverId: 5,
        content: "Yes, I have prepared some ideas for it.",
        timestamp: "Yesterday, 4:00 PM",
        read: true,
      },
      {
        id: 3003,
        senderId: 5,
        receiverId: 0,
        content: "Meeting scheduled for tomorrow at 10 AM.",
        timestamp: "Yesterday, 5:15 PM",
        read: true,
      },
    ],
  },
  {
    id: 104,
    participants: [sampleUsers[1]], // Ms. Hanh
    lastMessage: "Thank you for the information.",
    lastMessageTime: "Feb 08, 2024",
    status: "inactive",
    messages: [
      {
        id: 4001,
        senderId: 2,
        receiverId: 0,
        content: "Do you have the student reports ready?",
        timestamp: "Feb 08, 2024, 11:00 AM",
        read: true,
      },
      {
        id: 4002,
        senderId: 0,
        receiverId: 2,
        content: "Yes, I have attached them to the email.",
        timestamp: "Feb 08, 2024, 11:30 AM",
        read: true,
      },
      {
        id: 4003,
        senderId: 2,
        receiverId: 0,
        content: "Thank you for the information.",
        timestamp: "Feb 08, 2024, 12:00 PM",
        read: true,
      },
    ],
  },
  {
    id: 105,
    participants: [sampleUsers[3]], // Mr. Tuan
    lastMessage: "See you at the parent-teacher meeting.",
    lastMessageTime: "Jan 15, 2024",
    status: "inactive",
    messages: [
      {
        id: 5001,
        senderId: 4,
        receiverId: 0,
        content: "Parent-teacher meeting is scheduled for next week.",
        timestamp: "Jan 15, 2024, 2:00 PM",
        read: true,
      },
      {
        id: 5002,
        senderId: 0,
        receiverId: 4,
        content: "I will make sure to attend.",
        timestamp: "Jan 15, 2024, 2:15 PM",
        read: true,
      },
      {
        id: 5003,
        senderId: 4,
        receiverId: 0,
        content: "See you at the parent-teacher meeting.",
        timestamp: "Jan 15, 2024, 2:30 PM",
        read: true,
      },
    ],
  },
];
