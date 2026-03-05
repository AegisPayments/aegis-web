export function VideoSection() {
  return (
    <section className="py-20 px-4 bg-gray-900/30">
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
              <img
                src="/placeholder.png"
                alt="AegisPay Demo Video Placeholder"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                <div className="bg-blue-500/90 hover:bg-blue-500 rounded-full p-6 cursor-pointer transform hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-12 h-12 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
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
