import { getPublicContent } from "@/lib/cms/content";

import HomePageClient from "./components/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialContent = await getPublicContent();
  return <HomePageClient initialContent={initialContent} />;
}
