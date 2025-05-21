
import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import BottomNavBar from '@/components/BottomNavBar';

const AnalyticsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = React.useState('all');
  const [selectedMetric, setSelectedMetric] = React.useState('attendance');
  
  // Sample analytics data
  const attendanceData = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 88 },
    { name: 'Wed', value: 95 },
    { name: 'Thu', value: 90 },
    { name: 'Fri', value: 85 },
  ];
  
  const performanceData = [
    { name: 'Math', value: 85 },
    { name: 'Science', value: 78 },
    { name: 'English', value: 82 },
    { name: 'History', value: 75 },
    { name: 'Art', value: 90 },
  ];
  
  // Summary statistics
  const summaryStats = {
    attendance: {
      average: '90%',
      trend: '+2.5%',
      isPositive: true,
    },
    performance: {
      average: '82/100',
      trend: '+1.8%',
      isPositive: true,
    }
  };
  
  const chartData = selectedMetric === 'attendance' ? attendanceData : performanceData;
  const chartColor = selectedMetric === 'attendance' ? '#00CC66' : '#2874A6';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
      </div>
      
      {/* Filters */}
      <div className="px-5 mt-5">
        <div className="flex space-x-2 mb-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="10a">Class 10A</SelectItem>
              <SelectItem value="10b">Class 10B</SelectItem>
              <SelectItem value="11a">Class 11A</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="performance">Academic Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-500 mb-1">Average</h3>
            <p className="text-2xl font-bold">
              {summaryStats[selectedMetric as keyof typeof summaryStats].average}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-500 mb-1">Trend</h3>
            <p className={`text-2xl font-bold ${
              summaryStats[selectedMetric as keyof typeof summaryStats].isPositive 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {summaryStats[selectedMetric as keyof typeof summaryStats].trend}
            </p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
          <h2 className="text-lg font-bold mb-4">
            {selectedMetric === 'attendance' 
              ? 'Weekly Attendance Report' 
              : 'Subject Performance'
            }
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill={chartColor} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
          <h3 className="font-medium mb-2">Insights</h3>
          {selectedMetric === 'attendance' ? (
            <p className="text-sm text-gray-700">
              Attendance is generally good with an average of 90%. 
              Wednesday has the highest attendance rate, while Friday shows the lowest.
              Consider investigating reasons for Friday's drop.
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              Students are performing well in Art and Math subjects.
              History shows the lowest average score and might need additional attention
              or teaching strategy adjustments.
            </p>
          )}
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default AnalyticsPage;
