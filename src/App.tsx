
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Index from "./pages/Index";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import TeachersPage from "./pages/TeachersPage";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import FoodPage from "./pages/FoodPage";
import CheckInPage from "./pages/CheckInPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementsDetailPage from "./pages/AnnouncementsDetailPage";
import AddAnnouncementPage from "./pages/AddAnnouncementPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ChatOverviewPage from "./pages/ChatOverviewPage";
import SelectChatRecipientPage from "./pages/SelectChatRecipientPage";
import ChatDetailPage from "./pages/ChatDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in/*" element={<SignIn fallbackRedirectUrl="/" />} />
          <Route path="/sign-up/*" element={<SignUp fallbackRedirectUrl="/" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/:id" element={<TeacherDetailPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/check" element={<CheckInPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route
            path="/announcements/:id/edit"
            element={<AnnouncementsDetailPage />}
          />
          <Route
            path="/announcements/new"
            element={<AnnouncementsDetailPage />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/chat" element={<ChatOverviewPage />} />
          <Route path="/chat/new" element={<SelectChatRecipientPage />} />
          <Route path="/chat/new/:userId" element={<ChatDetailPage />} />
          <Route path="/chat/:id" element={<ChatDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
