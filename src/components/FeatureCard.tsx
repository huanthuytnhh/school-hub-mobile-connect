
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  link: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  link,
  className 
}) => {
  return (
    <Link to={link} className={cn("animate-fade-in", className)}>
      <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <div 
          className="feature-icon mb-2" 
          style={{ backgroundColor: color }}
        >
          <Icon strokeWidth={1.5} size={24} />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Link>
  );
};

export default FeatureCard;
