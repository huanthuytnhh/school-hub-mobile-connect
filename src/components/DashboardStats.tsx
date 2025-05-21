
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsItemProps {
  title: string;
  count: number;
  total: number;
  color: string;
}

export const StatsItem: React.FC<StatsItemProps> = ({ title, count, total, color }) => {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <div className="flex flex-col mb-1">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-sm font-bold">{count}</p>
      </div>
      <div className="stats-progress">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  attendanceCount: number;
  attendanceTotal: number;
  teachersCount: number;
  teachersTotal: number;
  date: string;
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  attendanceCount,
  attendanceTotal,
  teachersCount,
  teachersTotal,
  date,
  className
}) => {
  return (
    <div className={cn("p-5 rounded-3xl bg-white shadow-sm", className)}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatsItem 
          title="Total Students" 
          count={attendanceCount} 
          total={attendanceTotal} 
          color="bg-school-primary" 
        />
        <StatsItem 
          title="Total Teachers" 
          count={teachersCount} 
          total={teachersTotal} 
          color="bg-school-secondary" 
        />
      </div>
      <div className="flex justify-between">
        <div className="text-xs font-medium px-3 py-1 rounded-full bg-school-primary text-white">
          {Math.round((attendanceCount / attendanceTotal) * 100)}%
        </div>
        <div className="text-xs font-medium px-3 py-1 rounded-full bg-school-secondary text-white">
          {Math.round((teachersCount / teachersTotal) * 100)}%
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
