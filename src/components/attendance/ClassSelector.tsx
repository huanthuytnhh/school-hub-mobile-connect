
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassSelectorProps {
  selectedClass: string;
  handleClassChange: (classValue: string) => void;
  classes: string[];
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ selectedClass, handleClassChange, classes }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-school-secondary/20 rounded-xl shadow-sm p-4 mb-4 w-full text-left">
        <h2 className="text-school-primary font-semibold">
          Class {selectedClass}
        </h2>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full max-w-[90vw] bg-white">
        {classes.map((classItem) => (
          <DropdownMenuItem 
            key={classItem}
            onClick={() => handleClassChange(classItem)}
            className="cursor-pointer"
          >
            Class {classItem}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClassSelector;
