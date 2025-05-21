
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavBar from '@/components/BottomNavBar';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  calories: number;
  price: string;
}

const FoodPage: React.FC = () => {
  // Sample menu data
  const breakfast: MenuItem[] = [
    { id: 1, name: "Oatmeal", description: "With fresh berries and honey", calories: 320, price: "$3.50" },
    { id: 2, name: "Eggs & Toast", description: "Scrambled eggs with whole wheat toast", calories: 420, price: "$4.25" },
    { id: 3, name: "Fruit Parfait", description: "Yogurt with granola and mixed fruits", calories: 290, price: "$3.75" },
  ];
  
  const lunch: MenuItem[] = [
    { id: 4, name: "Grilled Chicken Salad", description: "With mixed greens and vinaigrette", calories: 380, price: "$5.50" },
    { id: 5, name: "Pasta Primavera", description: "Whole grain pasta with fresh vegetables", calories: 450, price: "$5.25" },
    { id: 6, name: "Turkey Sandwich", description: "On whole wheat bread with lettuce and tomato", calories: 410, price: "$4.75" },
  ];
  
  const snacks: MenuItem[] = [
    { id: 7, name: "Fresh Fruit Cup", description: "Seasonal fruits", calories: 120, price: "$2.50" },
    { id: 8, name: "Veggie Sticks", description: "With hummus dip", calories: 150, price: "$2.75" },
    { id: 9, name: "Granola Bar", description: "Homemade with nuts and dried fruits", calories: 180, price: "$2.25" },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Cafeteria Menu</h1>
        </div>
      </div>
      
      {/* Menu Tabs */}
      <div className="px-5 mt-5">
        <Tabs defaultValue="breakfast" className="w-full">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="breakfast" className="flex-1">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch" className="flex-1">Lunch</TabsTrigger>
            <TabsTrigger value="snacks" className="flex-1">Snacks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakfast" className="animate-fade-in">
            {breakfast.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </TabsContent>
          
          <TabsContent value="lunch" className="animate-fade-in">
            {lunch.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </TabsContent>
          
          <TabsContent value="snacks" className="animate-fade-in">
            {snacks.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Dietary Information</h3>
          <p className="text-sm text-blue-700">
            Please inform cafeteria staff of any allergies or dietary restrictions. 
            Vegetarian and gluten-free options are available upon request.
          </p>
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
      <div className="flex justify-between">
        <h3 className="font-medium">{item.name}</h3>
        <span className="font-bold text-school-primary">{item.price}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      <div className="mt-2 inline-block px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
        {item.calories} calories
      </div>
    </div>
  );
};

export default FoodPage;
