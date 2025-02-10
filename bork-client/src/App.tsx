import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 

import Home from "./routes/home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="dark antialiased"
        style={{
          colorScheme: "dark",
        }}
      >
        <BrowserRouter>
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 size-full container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                  </Routes>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
