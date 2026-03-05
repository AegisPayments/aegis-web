"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TerminalMockupProps {
  command?: string;
  output?: string;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  showNavHint?: boolean;
  isStartScreen?: boolean;
  onStart?: () => void;
}

export function TerminalMockup({
  command = "",
  output = "",
  isTyping = false,
  onTypingComplete,
  showNavHint = true,
  isStartScreen = false,
  onStart,
}: TerminalMockupProps) {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isTyping && command) {
      setDisplayedCommand("");
      setDisplayedOutput("");

      // Type out command
      let i = 0;
      const commandInterval = setInterval(() => {
        if (i <= command.length) {
          setDisplayedCommand(command.slice(0, i));
          i++;
        } else {
          clearInterval(commandInterval);

          // Show output after command is typed
          setTimeout(() => {
            setDisplayedOutput(output);
            onTypingComplete?.();
          }, 500);
        }
      }, 4);

      return () => clearInterval(commandInterval);
    }
  }, [command, output, isTyping, onTypingComplete]);

  // Clear displayed content when switching to start screen
  useEffect(() => {
    if (isStartScreen) {
      setDisplayedCommand("");
      setDisplayedOutput("");
    }
  }, [isStartScreen]);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Keyboard event handling for start screen
  useEffect(() => {
    if (isStartScreen && onStart) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          onStart();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [isStartScreen, onStart]);

  return (
    <div className="bg-black rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gray-900 px-4 py-2 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-sm font-mono">
          AegisPay CRE Terminal - Local Simulation
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm min-h-[400px]">
        {/* Command Line */}
        {displayedCommand && (
          <div className="mb-2">
            <span className="text-green-400">$</span>
            <span className="text-white ml-2">{displayedCommand}</span>
            {isTyping && showCursor && (
              <span className="text-green-400">█</span>
            )}
          </div>
        )}

        {/* Output */}
        {displayedOutput && (
          <div className="whitespace-pre-line text-gray-300 leading-relaxed">
            {displayedOutput.split("\\n").map((line, index) => {
              if (line.startsWith("✅")) {
                return (
                  <div key={index} className="text-green-400">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("🤖")) {
                return (
                  <div key={index} className="text-blue-400">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("💰") || line.startsWith("↩️")) {
                return (
                  <div key={index} className="text-cyan-400">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("📊") || line.startsWith("📋")) {
                return (
                  <div key={index} className="text-purple-400">
                    {line}
                  </div>
                );
              }
              return (
                <div key={index} className="text-gray-300">
                  {line}
                </div>
              );
            })}
          </div>
        )}

        {/* Default prompt when no command or on start screen */}
        {(!displayedCommand && !isTyping) || isStartScreen ? (
          <div className="text-gray-500">
            <div className="mb-2">
              <span className="text-green-400">$</span>
              <span className="ml-2">
                {isStartScreen
                  ? "Ready to begin simulation..."
                  : "Ready for simulation..."}
              </span>
              {showCursor && <span className="text-green-400">█</span>}
            </div>

            {showNavHint && (
              <div className="mt-6">
                {isStartScreen ? (
                  <>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2 text-green-400 animate-pulse">
                        <span className="text-sm bg-green-500/20 border border-green-500/30 px-3 py-1 rounded">
                          Press ENTER to start
                        </span>
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-600 mb-4">
                      Begin workflow simulation
                    </div>
                    <>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
                          <ChevronLeft className="w-4 h-4 opacity-60" />
                          <span className="text-xs">
                            Use navigation arrows or Click Action Buttons
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-60" />
                        </div>
                      </div>
                    </>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
                        <ChevronLeft className="w-4 h-4 opacity-60" />
                        <span className="text-sm">
                          Use navigation arrows or Click Action Buttons
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-600 mb-4">
                      Navigate between steps to see CRE workflow execution
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="text-xs mt-4 space-y-1">
              {isStartScreen ? (
                <>
                  <div className="text-cyan-400">
                    • Smart Contracts should be deployed.
                  </div>
                  <div className="text-blue-400">
                    • Merchant Should be Registered.
                  </div>
                  <div className="text-green-400">
                    • Funds should be deposited
                  </div>
                  <div className="text-purple-400">
                    • CRE workflow environment should be setup
                  </div>
                  <div className="text-yellow-200">
                    • See below for instructions or click enter to view the
                    simulated demo
                  </div>
                </>
              ) : (
                <>
                  <div className="text-cyan-400">
                    • Smart contracts deployed and verified
                  </div>
                  <div className="text-blue-400">
                    • Merchant registration complete
                  </div>
                  <div className="text-green-400">
                    • Funds deposited and available
                  </div>
                  <div className="text-purple-400">
                    • CRE workflow environment active
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
