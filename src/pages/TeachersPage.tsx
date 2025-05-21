
import React from 'react';
import { ArrowLeft, Search, User, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import BottomNavBar from '@/components/BottomNavBar';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  email: string;
  phone: string;
}

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Sample teacher data
  const teachers: Teacher[] = [
    { 
      id: 1, 
      name: "Dr. Robert Smith", 
      subject: "Mathematics", 
      email: "robert.smith@school.edu", 
      phone: "123-456-7890" 
    },
    { 
      id: 2, 
      name: "Prof. Sarah Johnson", 
      subject: "English", 
      email: "sarah.johnson@school.edu", 
      phone: "123-456-7891" 
    },
    { 
      id: 3, 
      name: "Mr. David Wilson", 
      subject: "Science", 
      email: "david.wilson@school.edu", 
      phone: "123-456-7892" 
    },
    { 
      id: 4, 
      name: "Mrs. Emily Brown", 
      subject: "History", 
      email: "emily.brown@school.edu", 
      phone: "123-456-7893" 
    },
    { 
      id: 5, 
      name: "Ms. Jessica Davis", 
      subject: "Art", 
      email: "jessica.davis@school.edu", 
      phone: "123-456-7894" 
    },
  ];

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Teachers</h1>
        </div>
        
        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 bg-white/90 text-gray-800 border-0"
            placeholder="Search by name or subject"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Teacher List */}
      <div className="px-5 mt-5">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Faculty Directory</h2>
        
        <div className="space-y-4 animate-fade-in">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-school-secondary flex items-center justify-center text-white mr-3">
                    <User size={20} />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p className="text-sm text-gray-600">{teacher.subject} Teacher</p>
                  </div>
                </div>
                
                <div className="ml-15 border-t border-gray-100 pt-2 mt-2">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Mail size={14} className="mr-2" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-2" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No teachers found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default TeachersPage;
