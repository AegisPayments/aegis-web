"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppMockupProps {
  title: string;
  currentAuth: string;
  balance: string;
  status: string;
  progress: number;
  onNextStep: () => void;
  stepTitle?: string;
  isComplete?: boolean;
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
              <img
                src="/placeholder.png"
                alt="App Icon"
                className="w-12 h-12 mx-auto mb-3 rounded-xl"
              />
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
            <Card className="bg-blue-900/20 border-blue-700 p-4 mb-6">
              <div className="text-center">
                <div className="text-blue-400 text-sm mb-1">
                  Current Authorization
                </div>
                <div className="text-xl font-bold text-blue-400">
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
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-medium py-3"
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
