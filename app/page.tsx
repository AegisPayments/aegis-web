import { Header } from "@/src/components/header";
import { HeroSection } from "@/src/components/hero-section";
import { FeatureGrid } from "@/src/components/feature-grid";
import { VideoSection } from "@/src/components/video-section";
import { Footer } from "@/src/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeatureGrid />
        <VideoSection videoUrl="https://youtube.com/watch?v=dQw4w9WgXcQ" />
      </main>

      <Footer />
    </div>
  );
}
