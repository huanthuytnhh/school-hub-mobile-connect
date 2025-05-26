import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  link?: string;
  onClick?: () => void; // Add onClick as an optional prop
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon: Icon,
  color,
  link,
  onClick, // Destructure onClick
  className,
}) => {
  return (
    <div
      onClick={onClick} // Add onClick handler
      className={cn("animate-fade-in cursor-pointer", className)}
    >
      <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <div
          className="feature-icon mb-2 p-2 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon strokeWidth={1.5} size={24} className="text-white" />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
};

export default FeatureCard;
