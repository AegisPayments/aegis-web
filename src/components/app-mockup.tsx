"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Car, Bot, Wallet } from "lucide-react";

interface AppMockupProps {
  title: string;
  currentAuth: string;
  balance: string;
  status: string;
  progress: number;
  onNextStep: () => void;
  stepTitle?: string;
  isComplete?: boolean;
  merchantType?: string;
}

export function AppMockup({
  title,
  currentAuth,
  balance,
  status,
  progress,
  onNextStep,
  stepTitle = "Next Step",
  isComplete = false,
  merchantType = "",
}: AppMockupProps) {
  const getStatusColor = (status: string) => {
    if (status.includes("Complete")) return "text-green-400";
    if (
      status.includes("Active") ||
      status.includes("Transit") ||
      status.includes("Processing")
    )
      return "text-blue-400";
    return "text-yellow-400";
  };

  const getProgressColor = () => {
    if (progress === 100) return "bg-green-400";
    if (progress > 50) return "bg-blue-400";
    return "bg-yellow-400";
  };

  const getScenarioIcon = (merchantType: string) => {
    const iconClass = "w-8 h-8 text-white";
    switch (merchantType) {
      case "EV_CHARGER":
        return <Zap className={iconClass} />;
      case "RIDE_SHARE":
        // return <Navigation className={iconClass} />;
        return <Car className={iconClass} />;
      case "GENERIC":
      case "RETAIL": // TODO: add an icon type parameter to demos.ts cause we don't have a merchant type as AI_AGENT. AI_AGENT is registered as Generic or Retail type.
        return <Bot className={iconClass} />;
      default:
        return <Wallet className={iconClass} />;
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-black rounded-[2rem] overflow-hidden">
          {/* Phone Status Bar */}
          <div className="bg-black px-6 py-2 flex justify-between items-center text-white text-xs">
            <span>9:41 AM</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3/4 h-full bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-[600px]">
            {/* App Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                {getScenarioIcon(merchantType)}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
              <Badge
                variant="secondary"
                className={`${getStatusColor(status)} bg-transparent border border-current`}
              >
                {status}
              </Badge>
            </div>

            {/* Balance Card */}
            <Card className="bg-gray-800/50 border-gray-700 p-4 mb-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">
                  Available Balance
                </div>
                <div className="text-2xl font-bold text-white">{balance}</div>
              </div>
            </Card>

            {/* Current Authorization */}
            <Card className="bg-cyan-900/20 border-cyan-500/30 p-4 mb-6">
              <div className="text-center">
                <div className="text-cyan-300 text-sm mb-1">
                  Current Authorization
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  {currentAuth}
                </div>
              </div>
            </Card>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">Progress</div>
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {progress}%
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onNextStep}
              disabled={isComplete}
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-medium py-3"
            >
              {isComplete ? "Demo Complete" : stepTitle}
            </Button>

            {/* Additional Info */}
            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <div>• Funds secured in AegisPay ledger</div>
              <div>• AI risk engine monitoring</div>
              <div>• Real-time authorization updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
