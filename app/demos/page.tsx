"use client";

import { useState, useRef } from "react";
import { Header } from "@/src/components/header";
import { AppMockup } from "@/src/components/app-mockup";
import { TerminalMockup } from "@/src/components/terminal-mockup";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { demoConfig } from "@/src/config/demos";
import { Footer } from "@/src/components/footer";

export default function DemosPage() {
  const [selectedScenario, setSelectedScenario] = useState(
    demoConfig.scenarios[0],
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [simulationMode, setSimulationMode] = useState("view-only"); // "view-only" | "hands-on"
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioCategory, setScenarioCategory] = useState<
    "standard" | "rejection"
  >("standard");
  const simulationRef = useRef<HTMLDivElement>(null);

  const handleNextStep = () => {
    if (currentStep === -1) {
      // Start the demo from beginning
      setIsTyping(true);
      setCurrentStep(0);
    } else if (currentStep < selectedScenario.steps.length - 1) {
      setIsTyping(true);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
      setIsTyping(false);
    }
  };

  const handleStart = () => {
    setIsTyping(true);
    setCurrentStep(0);
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = demoConfig.scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setCurrentStep(-1);
      setIsTyping(false);
      // Auto-scroll to simulation section with proper offset
      setTimeout(() => {
        if (simulationRef.current) {
          const elementTop = simulationRef.current.getBoundingClientRect().top;
          const offsetPosition = elementTop + window.pageYOffset - 80; // 80px space above navigation panel

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  const currentStepData =
    currentStep >= 0 ? selectedScenario.steps[currentStep] : null;
  const isComplete = currentStep === selectedScenario.steps.length - 1;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Interactive <span className="aegis-text-cyber">Demo Console</span>
          </h1>

          {/* Mode Toggle */}
          <div className="flex items-center space-x-3">
            <span
              className={`text-sm ${!isSimulationMode ? "text-gray-500" : "text-white"}`}
            >
              Simulation Mode
            </span>
            <Switch
              checked={!isSimulationMode}
              disabled={true}
              className="opacity-50"
            />
            <span
              className={`text-sm ${isSimulationMode ? "text-gray-500" : "text-white"}`}
            >
              Deployed
            </span>
            <Badge variant="secondary" className="ml-2">
              Invite-Only
            </Badge>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Choose Demo Scenario</h2>

            {/* Category Toggle */}
            <div className="flex rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setScenarioCategory("standard")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  scenarioCategory === "standard"
                    ? "bg-cyan-500/20 text-cyan-300 border-r border-cyan-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-r border-gray-700"
                }`}
              >
                Standard Flows
              </button>
              <button
                onClick={() => setScenarioCategory("rejection")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  scenarioCategory === "rejection"
                    ? "bg-red-500/20 text-red-300"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                Security Scenarios
              </button>
            </div>
          </div>

          <div
            className={`grid gap-6 ${
              scenarioCategory === "standard"
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
            }`}
          >
            {demoConfig.scenarios
              .filter((s) =>
                scenarioCategory === "standard"
                  ? s.flowType !== "rejection"
                  : s.flowType === "rejection",
              )
              .map((scenario) => {
                const isRejection = scenario.flowType === "rejection";
                const isSelected = selectedScenario.id === scenario.id;

                return (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? isRejection
                          ? "ring-2 ring-red-400 bg-red-500/10 border-red-400/30"
                          : "ring-2 ring-cyan-400 bg-cyan-500/10 border-cyan-400/30"
                        : isRejection
                          ? "aegis-glass hover:border-red-400/40 hover:-translate-y-1"
                          : "aegis-glass hover:border-cyan-400/40 hover:-translate-y-1"
                    }`}
                    onClick={() => handleScenarioChange(scenario.id)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-white text-lg mb-2">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                        {scenario.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            isSelected
                              ? isRejection
                                ? "border-red-400/50 text-red-300"
                                : "border-cyan-400/50 text-cyan-300"
                              : "border-gray-600 text-gray-400"
                          }`}
                        >
                          {scenario.merchantType}
                        </Badge>
                        {isRejection && (
                          <Badge
                            variant="outline"
                            className="text-xs border-red-500/40 text-red-400"
                          >
                            REJECTION FLOW
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Demo Simulation */}
        <div ref={simulationRef} className="relative">
          {/* Simplified Navigation Panel */}
          <div className="mb-8">
            <Card className="aegis-glass border-transparent bg-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === -1}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      currentStep === -1
                        ? "border-gray-700 text-gray-600 cursor-not-allowed opacity-50"
                        : "border-cyan-400/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-cyan-300 mb-2">
                      {currentStep === -1
                        ? "Demo Ready"
                        : `Step ${currentStep + 1} of ${selectedScenario.steps.length}`}
                    </div>
                    <div className="flex space-x-1 justify-center">
                      {selectedScenario.steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentStep >= 0 && index <= currentStep
                              ? "bg-cyan-400"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={isComplete}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      isComplete
                        ? "border-gray-700 text-gray-600 cursor-not-allowed opacity-50"
                        : "border-cyan-400/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Simulation Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - App Mockup */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-cyan-300">
                  User Experience
                </h3>
                <p className="text-sm text-gray-400">
                  {selectedScenario.description}
                </p>
              </div>

              <AppMockup
                title={selectedScenario.title}
                currentAuth={currentStepData?.appState?.currentAuth || "$0.00"}
                balance={currentStepData?.appState?.balance || "$1000.00"}
                status={currentStepData?.appState?.status || "Ready"}
                progress={currentStepData?.appState?.progress || 0}
                onNextStep={handleNextStep}
                stepTitle={
                  isComplete
                    ? "Simulation Complete"
                    : selectedScenario.steps[currentStep + 1]?.appState
                          ?.actionStepTitle || "Start"
                }
                isComplete={isComplete}
                merchantType={selectedScenario.merchantType}
              />
            </div>
            {/* Right Side - Terminal Mockup */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-cyan-300">
                  CRE Workflow Execution
                </h3>
                <p className="text-sm text-gray-400">
                  Chainlink Runtime Environment with AI Risk Assessment
                </p>
              </div>

              <TerminalMockup
                panes={
                  currentStep === -1
                    ? undefined
                    : currentStepData?.terminalPanes
                }
                isTyping={isTyping}
                onTypingComplete={() => setIsTyping(false)}
                showNavHint={true}
                isStartScreen={currentStep === -1}
                onStart={handleStart}
              />

              {/* Current Step Info - Moved here */}
              {currentStep === -1 ? (
                <Card className="aegis-glass border-cyan-400/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-cyan-400 mb-3 text-lg">
                      Get Started
                    </h4>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      Welcome to the {selectedScenario.title} simulation. This
                      interactive demo will walk you through the complete CRE
                      workflow with real-time authorization adjustments.
                    </p>
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-blue-400 font-medium">
                          Instructions:
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs ${simulationMode === "view-only" ? "text-cyan-300" : "text-gray-400"}`}
                          >
                            View-Only
                          </span>
                          <Switch
                            checked={simulationMode === "hands-on"}
                            onCheckedChange={(checked) =>
                              setSimulationMode(
                                checked ? "hands-on" : "view-only",
                              )
                            }
                          />
                          <span
                            className={`text-xs ${simulationMode === "hands-on" ? "text-cyan-300" : "text-gray-400"}`}
                          >
                            Hands-On
                          </span>
                        </div>
                      </div>
                      {simulationMode === "view-only" ? (
                        <div className="text-sm text-blue-300">
                          Click "Authorize" button in mobile UI or press Enter in CLI to begin the guided
                          simulation
                        </div>
                      ) : (
                        <div className="text-sm text-blue-300 space-y-2">
                          <div>
                            For hands-on testing, (see{" "}
                            <a
                              href="/docs#deployment"
                              target="_blank"
                              className="font-mono bg-blue-500/20 px-1 rounded text-blue-300 underline hover:text-blue-200 transition-colors"
                            >
                              deployment docs
                            </a>
                            ) you need to:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-xs text-blue-300/80">
                            <li>Deploy smart contracts</li>
                            <li>Deposit funds into protocol</li>
                            <li>Register as merchant</li>
                          </ul>
                          <div className="text-xs text-blue-400 pt-1">
                            Switch to View mode for guided demo
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="aegis-glass border-cyan-400/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-cyan-400 mb-3 text-lg">
                      {currentStepData?.title}
                    </h4>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {currentStepData?.description}
                    </p>
                    {currentStepData?.userAction &&
                      (() => {
                        const isRejectionStep =
                          currentStepData?.appState?.status?.includes(
                            "Rejected",
                          ) ||
                          currentStepData?.appState?.status?.includes("Locked");
                        return (
                          <div
                            className={`mt-4 p-3 rounded-lg ${
                              isRejectionStep
                                ? "bg-red-500/10 border border-red-500/20"
                                : "bg-green-500/10 border border-green-500/20"
                            }`}
                          >
                            <div
                              className={`text-sm font-medium mb-1 ${
                                isRejectionStep
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {isRejectionStep
                                ? "Security Event:"
                                : "User Action:"}
                            </div>
                            <div
                              className={`text-sm ${
                                isRejectionStep
                                  ? "text-red-300"
                                  : "text-green-300"
                              }`}
                            >
                              {currentStepData.userAction}
                            </div>
                          </div>
                        );
                      })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bottom Progress Indicator */}
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {selectedScenario.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-blue-400" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Step {currentStep + 1} of {selectedScenario.steps.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
