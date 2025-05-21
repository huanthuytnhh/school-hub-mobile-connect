
import React from 'react';
import { ArrowLeft, Users, Calendar, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavBar from '@/components/BottomNavBar';

interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'general' | 'event' | 'urgent' | 'notice';
}

const AnnouncementsPage: React.FC = () => {
  // Sample announcements data
  const announcements: Announcement[] = [
    { 
      id: 1, 
      title: "School Assembly", 
      message: "All students must attend the general assembly in the main hall tomorrow at 9:00 AM.", 
      date: "May 22, 2025", 
      type: "general" 
    },
    { 
      id: 2, 
      title: "Annual Sports Day", 
      message: "The annual sports day will be held next Friday. Parents are invited to attend and cheer for their children.", 
      date: "May 26, 2025", 
      type: "event" 
    },
    { 
      id: 3, 
      title: "Early Dismissal", 
      message: "Due to teacher training, all students will be dismissed at 1:00 PM this Thursday.", 
      date: "May 23, 2025", 
      type: "notice" 
    },
    { 
      id: 4, 
      title: "Weather Warning", 
      message: "Due to forecast of heavy rain, outdoor activities will be cancelled tomorrow. Please bring umbrellas.", 
      date: "May 21, 2025", 
      type: "urgent" 
    },
  ];

  const getAnnouncementsByType = (type: string) => {
    if (type === 'all') return announcements;
    return announcements.filter(announcement => announcement.type === type);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'general': return <Users className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'urgent': return <AlertCircle className="h-5 w-5" />;
      case 'notice': return <Info className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-600';
      case 'event': return 'bg-purple-100 text-purple-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'notice': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Announcements</h1>
        </div>
      </div>
      
      {/* Announcements Tabs */}
      <div className="px-5 mt-5">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="event" className="flex-1">Events</TabsTrigger>
            <TabsTrigger value="urgent" className="flex-1">Urgent</TabsTrigger>
          </TabsList>
          
          {['all', 'general', 'event', 'urgent', 'notice'].map(type => (
            <TabsContent key={type} value={type} className="animate-fade-in">
              {getAnnouncementsByType(type).length > 0 ? (
                getAnnouncementsByType(type).map(announcement => (
                  <div key={announcement.id} className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${getColorForType(announcement.type)}`}>
                        {getIconForType(announcement.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <span className="text-xs text-gray-500">{announcement.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{announcement.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No announcements in this category
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default AnnouncementsPage;
