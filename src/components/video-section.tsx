"use client";

interface VideoSectionProps {
  videoUrl?: string;
}

export function VideoSection({ videoUrl }: VideoSectionProps) {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  return (
    <section id="video-section" className="py-20 px-4 bg-gray-900/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See <span className="aegis-text-cyber">AegisPay</span> in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Watch how our AI-powered risk engine enables seamless dynamic
            pricing while protecting user funds from infinite approval exploits.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aegis-glass border-blue-500/20 group hover:border-blue-500/40 transition-all duration-300">
            {/* 16:9 Aspect Ratio Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              {videoId ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="AegisPay Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">📹</div>
                    <p>Video will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6 bg-gray-900/60 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-2">
                AegisPay: The Future of Web3 Payments
              </h3>
              <p className="text-gray-400">
                Learn how we're bringing TradFi security to DeFi payments
                through AI-powered risk assessment and dynamic authorization
                management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
