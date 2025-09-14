import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/ui/auth-guard";
import { MainLayout } from "@/components/layout/main-layout";
import KidContext from "./pages/kid-context";
import Stories from "./pages/stories";
import Courses from "./pages/courses";
import Games from "./pages/games";
import Search from "./pages/search";
import Settings from "./pages/settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <MainLayout>
            <Routes>
              <Route path="/" element={<KidContext />} />
              <Route path="/kid-context" element={<KidContext />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/games" element={<Games />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
