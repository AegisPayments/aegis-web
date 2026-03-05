"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export function HeroSection() {
  const scrollToVideo = () => {
    const videoSection = document.getElementById("video-section");
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block mb-2">The Decentralized</span>
            <span className="block mb-2 aegis-text-cyber">
              Settlement Layer
            </span>
            <span className="block">for Web3 Commerce</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-4xl mx-auto">
            Bringing Visa-style{" "}
            <span className="text-blue-400">'Auth & Capture'</span> to smart
            contracts. Powering dynamic pricing for DePIN, AI Agents, and
            real-world services with
            <span className="text-green-400"> off-chain risk engines</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-medium px-8 py-6 text-lg min-w-[200px]"
            >
              <Link href="/demos">{siteConfig.hero.ctaText}</Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToVideo}
              className="border-blue-500/30 hover:border-blue-500/60 text-blue-400 hover:text-white bg-transparent px-8 py-6 text-lg min-w-[200px]"
            >
              <Play className="w-5 h-5 mr-2" />
              {siteConfig.hero.secondaryCta}
            </Button>
          </div>

          {/* Platform Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aegis-glass rounded-2xl p-8 border-blue-500/20">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 h-64 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-[url('/hero_section_bg.png')] bg-cover bg-center opacity-30"></div>
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4 text-cyan-400 animate-pulse">
                    ⚡
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    AegisPay Protocol
                  </h3>
                  <p className="text-gray-400 text-center">
                    Real-time risk assessment • Dynamic authorization • Smart
                    contract integration
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                AegisPay Protocol Dashboard - AI Risk Engine in Action
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
