"use client";

import { useState, useEffect } from "react";

interface TerminalMockupProps {
  command?: string;
  output?: string;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}

export function TerminalMockup({
  command = "",
  output = "",
  isTyping = false,
  onTypingComplete,
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
      }, 30);

      return () => clearInterval(commandInterval);
    }
  }, [command, output, isTyping, onTypingComplete]);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

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

        {/* Default prompt when no command */}
        {!displayedCommand && !isTyping && (
          <div className="text-gray-500">
            <div className="mb-2">
              <span className="text-green-400">$</span>
              <span className="ml-2">Ready for simulation...</span>
              {showCursor && <span className="text-green-400">█</span>}
            </div>
            <div className="text-xs mt-4 space-y-1">
              <div>• Click "Next Step" to run CRE workflow simulation</div>
              <div>• Watch AI risk engine evaluate payment requests</div>
              <div>• See real-time authorization adjustments</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
