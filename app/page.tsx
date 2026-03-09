import { Header } from "@/src/components/header";
import { HeroSection } from "@/src/components/hero-section";
import { FeatureGrid } from "@/src/components/feature-grid";
import { HowItWorks } from "@/src/components/how-it-works";
import { VideoSection } from "@/src/components/video-section";
import { Footer } from "@/src/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeatureGrid />
        {/* <HowItWorks /> */}
        {/* <VideoSection videoUrl="https://youtube.com/watch?v=dQw4w9WgXcQ" /> */}
        <VideoSection videoUrl="https://youtu.be/5Pnyc_w6xvY" />
      </main>

      <Footer />
    </div>
  );
}
