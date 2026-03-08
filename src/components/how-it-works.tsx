import { Wallet, ShieldCheck, BrainCircuit, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

const steps = [
  {
    icon: Wallet,
    title: "Deposit",
    description:
      "User deposits USDC into the checking account ledger smart contract.",
  },
  {
    icon: ShieldCheck,
    title: "Authorize",
    description:
      "User signs a time-limited off-chain authorization for a base amount.",
  },
  {
    icon: BrainCircuit,
    title: "Dynamic Increment",
    description:
      "Merchant requests an increment. Chainlink CRE AI Risk Engine evaluates and approves on-chain.",
  },
  {
    icon: CheckCircle,
    title: "Capture & Release",
    description:
      "Merchant captures final amount. Unused auth is instantly released back to the user\u2019s free balance.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="aegis-text-cyber">AegisPay</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Four simple steps from deposit to settlement, with dynamic risk-based increments.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={index} className="relative flex flex-col items-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-blue-500/40 to-blue-500/10" />
                )}

                <Card className="aegis-glass border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group w-full">
                  <CardContent className="p-8 text-center">
                    {/* Step number */}
                    <div className="mb-4 text-sm font-mono text-blue-400/60">
                      Step {index + 1}
                    </div>

                    <div className="mb-6 flex justify-center">
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                        <Icon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
