
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import IPTracker from "./pages/IPTracker";
import PhoneTracker from "./pages/PhoneTracker";
import UsernameTracker from "./pages/UsernameTracker";
import FileSharing from "./pages/FileSharing";
import FileSecurity from "./pages/FileSecurity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton={true} />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/ip-tracker" element={<IPTracker />} />
            <Route path="/phone-tracker" element={<PhoneTracker />} />
            <Route path="/username-tracker" element={<UsernameTracker />} />
            <Route path="/file-sharing" element={<FileSharing />} />
            <Route path="/file-security" element={<FileSecurity />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
