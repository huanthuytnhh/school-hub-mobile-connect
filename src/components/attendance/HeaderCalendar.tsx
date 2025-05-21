
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderCalendarProps {
  date: Date;
  setDate: (date: Date) => void;
}

const HeaderCalendar: React.FC<HeaderCalendarProps> = ({ date, setDate }) => {
  return (
    <div className="bg-school-primary text-white p-4">
      <div className="flex items-center mb-3">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Select Date</h1>
        <div className="ml-auto">
          <span className="text-sm">March 2025</span>
        </div>
      </div>
      
      {/* Calendar View - Simplified weekday selector */}
      <div className="py-2">
        <div className="flex justify-between text-xs mb-2">
          <span>MO</span>
          <span>TU</span>
          <span>WE</span>
          <span>TH</span>
          <span>FR</span>
          <span>SA</span>
          <span>SU</span>
        </div>
        <div className="flex justify-between">
          {[18, 19, 20, 21, 22, 23, 24].map((day) => (
            <button 
              key={day}
              onClick={() => setDate(new Date(2025, 2, day))}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                date.getDate() === day ? 'bg-white text-school-primary' : 'bg-transparent'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderCalendar;
