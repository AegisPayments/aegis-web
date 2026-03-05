"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Car, Bot, Wallet, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

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
  // Live interactive states
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [signalBars, setSignalBars] = useState(4);
  const [networkActive, setNetworkActive] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update clock every second (only after mounting)
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  // Simulate battery drain and signal changes
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel((prev) => {
        const newLevel = prev - Math.random() * 0.1; // Very slow drain
        return Math.max(10, newLevel); // Don't go below 10%
      });
    }, 30000); // Every 30 seconds

    const signalTimer = setInterval(() => {
      setSignalBars(Math.floor(Math.random() * 3) + 3); // 3-5 bars
    }, 15000); // Every 15 seconds

    const networkTimer = setInterval(
      () => {
        setNetworkActive(true);
        setTimeout(() => setNetworkActive(false), 200);
      },
      Math.random() * 10000 + 5000,
    ); // Random network activity

    return () => {
      clearInterval(batteryTimer);
      clearInterval(signalTimer);
      clearInterval(networkTimer);
    };
  }, []);

  const getBatteryColor = () => {
    const level = mounted ? batteryLevel : 87;
    if (level > 50) return "bg-green-400";
    if (level > 20) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getBatteryBorderColor = () => {
    const level = mounted ? batteryLevel : 87;
    if (level > 50) return "border-green-400";
    if (level > 20) return "border-yellow-400";
    return "border-red-400";
  };
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
            <span className="font-medium">
              {
                mounted
                  ? currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "12:00" // Static fallback during server render
              }
            </span>
            <div className="flex items-center space-x-2">
              {/* Network Activity Indicator */}
              <div className="flex space-x-[1px]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      i < (mounted ? signalBars : 4)
                        ? mounted && networkActive
                          ? "bg-cyan-400 shadow-cyan-400/50 shadow-sm"
                          : "bg-white"
                        : "bg-gray-600"
                    }`}
                    style={{ height: `${6 + i * 2}px` }}
                  />
                ))}
              </div>

              {/* WiFi Icon */}
              <Wifi
                className={`w-3 h-3 transition-colors duration-300 ${
                  mounted && networkActive ? "text-cyan-400" : "text-white"
                }`}
              />

              {/* Battery */}
              <div
                className={`w-6 h-3 border rounded-sm transition-colors duration-300 ${getBatteryBorderColor()}`}
              >
                <div
                  className={`h-full rounded-sm transition-all duration-1000 ${getBatteryColor()}`}
                  style={{
                    width: `${Math.max(mounted ? batteryLevel : 87, 5)}%`,
                  }}
                />
                {/* Battery tip */}
                <div
                  className={`absolute w-[2px] h-2 rounded-r-sm ml-6 -mt-[9px] transition-colors duration-300 ${
                    (mounted ? batteryLevel : 87) > 20
                      ? "bg-white"
                      : getBatteryColor()
                  }`}
                />
              </div>

              {/* Battery percentage */}
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  (mounted ? batteryLevel : 87) > 20
                    ? "text-white"
                    : "text-red-400"
                }`}
              >
                {Math.round(mounted ? batteryLevel : 87)}%
              </span>
            </div>
          </div>

          {/* App Content */}
          <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-[600px]">
            {/* App Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center relative overflow-hidden group">
                {/* Subtle breathing animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-xl animate-pulse opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                {/* Icon with subtle scale animation */}
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {getScenarioIcon(merchantType)}
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1 transition-all duration-300 hover:text-cyan-300">
                {title}
              </h2>
              <Badge
                variant="secondary"
                className={`${getStatusColor(status)} bg-transparent border border-current transition-all duration-300 hover:shadow-lg hover:shadow-current/20`}
              >
                {status}
              </Badge>
            </div>

            {/* Balance Card */}
            <Card className="bg-gray-800/50 border-gray-700 p-4 mb-6 transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-600 hover:shadow-lg hover:shadow-white/5 group">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1 transition-colors duration-300 group-hover:text-gray-300">
                  Available Balance
                </div>
                <div className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-105">
                  {balance}
                </div>
              </div>
            </Card>

            {/* Current Authorization */}
            <Card className="bg-cyan-900/20 border-cyan-500/30 p-4 mb-6 transition-all duration-300 hover:bg-cyan-900/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 group relative overflow-hidden">
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="text-center relative z-10">
                <div className="text-cyan-300 text-sm mb-1 transition-colors duration-300 group-hover:text-cyan-200">
                  Current Authorization
                </div>
                <div className="text-xl font-bold text-cyan-400 transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-105">
                  {currentAuth}
                </div>
              </div>
            </Card>

            {/* Progress Bar */}
            <div className="mb-6 group">
              <div className="text-gray-400 text-sm mb-2 transition-colors duration-300 group-hover:text-gray-300">
                Progress
              </div>
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-current/20">
                <div
                  className={`h-full ${getProgressColor()} transition-all duration-500 ease-out relative overflow-hidden`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-400">
                {progress}%
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onNextStep}
              disabled={isComplete}
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-medium py-3 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isComplete ? "Simulation Complete" : stepTitle}
              </span>
              {!isComplete && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Button>

            {/* Additional Info */}
            <div className="mt-6 text-xs text-gray-500 space-y-1">
              {[
                "Funds secured in AegisPay ledger",
                "AI risk engine monitoring",
                "Real-time authorization updates",
              ].map((text, index) => (
                <div
                  key={index}
                  className="transition-all duration-300 hover:text-gray-400 hover:translate-x-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  • {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
