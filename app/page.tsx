import { Header } from "@/src/components/header";
import { HeroSection } from "@/src/components/hero-section";
import { FeatureGrid } from "@/src/components/feature-grid";
import { VideoSection } from "@/src/components/video-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeatureGrid />
        <VideoSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience the Future of Web3 Payments?
            </h3>
            <p className="text-gray-400 mb-6">
              Join the simulation and see how AegisPay transforms dynamic
              pricing for real-world services.
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <p>
              &copy; 2026 AegisPay. Building the settlement layer for the
              machine economy.
            </p>
            <p>Powered by Chainlink CRE • Built for institutional-grade DeFi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
