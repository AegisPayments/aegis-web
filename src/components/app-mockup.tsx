"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Zap, Car, Bot, Wallet, Wifi, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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
  userWallet?: string;
  isSigningStep?: boolean;
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
  userWallet = "",
  isSigningStep = false,
}: AppMockupProps) {
  // Live interactive states
  const [mounted, setMounted] = useState(false);
  const [cardPhase, setCardPhase] = useState<
    "idle" | "presenting" | "signing" | "complete"
  >("idle");
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
    if (
      status.includes("Rejected") ||
      status.includes("Locked") ||
      status.includes("Flagged")
    )
      return "text-red-400";
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

  const truncateWallet = (addr: string) =>
    addr ? `${addr.slice(0, 6)}····${addr.slice(-4)}` : "";

  const handleActionClick = useCallback(() => {
    if (isComplete) return;
    if (isSigningStep) {
      setCardPhase("presenting");
      setTimeout(() => setCardPhase("signing"), 500);
      setTimeout(() => setCardPhase("complete"), 1400);
      setTimeout(() => {
        setCardPhase("idle");
        onNextStep();
      }, 2000);
    } else {
      onNextStep();
    }
  }, [isSigningStep, isComplete, onNextStep]);

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
                  Account Balance
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
                  Authorization
                </div>
                <div className="text-xl font-bold text-cyan-400 transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-105">
                  {currentAuth}
                </div>
              </div>
            </Card>

            {/* Aegis Card Overlay */}
            {cardPhase !== "idle" && (
              <div
                className={`mb-6 transition-all duration-500 ${
                  cardPhase === "presenting"
                    ? "opacity-0 translate-y-4 scale-95 animate-[cardIn_0.5s_ease-out_forwards]"
                    : cardPhase === "complete"
                      ? "opacity-100 scale-95 translate-y-2"
                      : "opacity-100 translate-y-0 scale-100"
                }`}
              >
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-cyan-500/30 p-4 shadow-lg shadow-cyan-400/10">
                  {/* Card shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />

                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold tracking-widest text-cyan-400">
                        AEGIS
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Contactless icon */}
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-5 h-5 transition-colors duration-300 ${cardPhase === "signing" ? "text-cyan-400 animate-pulse" : "text-gray-500"}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                        <path d="M12 19a9 9 0 0 1 0-14" />
                        <path d="M15.5 21.5a13 13 0 0 1 0-19" />
                      </svg>
                    </div>
                  </div>

                  {/* Card chip */}
                  <div className="mb-3 relative z-10">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-600/80 to-yellow-800/80 border border-yellow-500/30 flex items-center justify-center">
                      <div className="w-6 h-4 rounded-sm border border-yellow-500/40 grid grid-cols-2 grid-rows-2 gap-px">
                        <div className="bg-yellow-600/50 rounded-tl-sm" />
                        <div className="bg-yellow-600/50 rounded-tr-sm" />
                        <div className="bg-yellow-600/50 rounded-bl-sm" />
                        <div className="bg-yellow-600/50 rounded-br-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Wallet address as card number */}
                  <div className="mb-3 relative z-10">
                    <div className="font-mono text-sm tracking-wider text-gray-300">
                      {truncateWallet(userWallet)}
                    </div>
                  </div>

                  {/* Signing status */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">
                      EIP-712 Signature
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cardPhase === "signing" && (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[10px] font-medium">
                            Signing...
                          </span>
                        </div>
                      )}
                      {cardPhase === "complete" && (
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-[10px] font-medium">
                            Signed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              onClick={handleActionClick}
              disabled={isComplete || cardPhase !== "idle"}
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
