"use client";

import { useState } from "react";
import { Header } from "@/src/components/header";
import { AppMockup } from "@/src/components/app-mockup";
import { TerminalMockup } from "@/src/components/terminal-mockup";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { demoConfig } from "@/src/config/demos";

export default function DemosPage() {
  const [selectedScenario, setSelectedScenario] = useState(
    demoConfig.scenarios[0],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const handleNextStep = () => {
    if (currentStep < selectedScenario.steps.length - 1) {
      setIsTyping(true);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = demoConfig.scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setCurrentStep(0);
      setIsTyping(false);
    }
  };

  const currentStepData = selectedScenario.steps[currentStep];
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Demo Scenario</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {demoConfig.scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedScenario.id === scenario.id
                    ? "ring-2 ring-blue-500 bg-blue-500/10"
                    : "aegis-glass hover:border-blue-500/40"
                }`}
                onClick={() => handleScenarioChange(scenario.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {scenario.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {scenario.merchantType}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Simulation */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - App Mockup */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">User Experience</h3>
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
              stepTitle={isComplete ? "Demo Complete" : "Next Step"}
              isComplete={isComplete}
            />

            {/* Current Step Info */}
            <Card className="aegis-glass border-blue-500/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-400 mb-2">
                  Step {currentStep + 1}: {currentStepData?.title}
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  {currentStepData?.description}
                </p>
                {currentStepData?.userAction && (
                  <div className="text-xs text-green-400">
                    Action: {currentStepData.userAction}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Terminal Mockup */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                CRE Workflow Execution
              </h3>
              <p className="text-sm text-gray-400">
                Chainlink Runtime Environment with AI Risk Assessment
              </p>
            </div>

            <TerminalMockup
              command={currentStepData?.terminalCommand}
              output={currentStepData?.terminalOutput}
              isTyping={isTyping}
              onTypingComplete={() => setIsTyping(false)}
            />
          </div>
        </div>

        {/* Progress Indicator */}
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
      </main>
    </div>
  );
}
