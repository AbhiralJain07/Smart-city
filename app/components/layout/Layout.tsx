import { ReactNode } from "react";

import { getAdminSession } from "@/lib/cms/auth";

import { ThemeProvider } from "../theme-provider";
import { VercelNavbar } from "../ui/vercel-navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getAdminSession();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background-primary">
        <VercelNavbar session={session} />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
