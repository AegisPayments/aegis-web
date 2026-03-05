import { Shield, Zap, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/src/config/site";

const iconMap = {
  shield: Shield,
  zap: Zap,
  brain: Brain,
};

export function FeatureGrid() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="aegis-text-cyber">AegisPay</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Traditional Web3 payments force impossible choices. AegisPay brings
            institutional-grade security without compromising user experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {siteConfig.features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <Card
                key={index}
                className="aegis-glass border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
