"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TerminalPane } from "@/src/config/demos";

interface TerminalMockupProps {
  panes?: TerminalPane[];
  isTyping?: boolean;
  onTypingComplete?: () => void;
  showNavHint?: boolean;
  isStartScreen?: boolean;
  onStart?: () => void;
}

export function TerminalMockup({
  panes,
  isTyping = false,
  onTypingComplete,
  showNavHint = true,
  isStartScreen = false,
  onStart,
}: TerminalMockupProps) {
  const [activePaneIndex, setActivePaneIndex] = useState(0);
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [isPaneTyping, setIsPaneTyping] = useState(false);
  const [completedPanes, setCompletedPanes] = useState<
    Map<number, { command: string; output: string }>
  >(new Map());
  const [showCursor, setShowCursor] = useState(true);
  const [typingKey, setTypingKey] = useState(0);

  // Refs to avoid stale closures in async callbacks
  const panesRef = useRef(panes);
  const typingPaneIndexRef = useRef(0);
  const typingSessionRef = useRef(0);
  const onTypingCompleteRef = useRef(onTypingComplete);

  useEffect(() => {
    onTypingCompleteRef.current = onTypingComplete;
  }, [onTypingComplete]);

  useEffect(() => {
    panesRef.current = panes;
  }, [panes]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  // Reset when panes change (step change)
  useEffect(() => {
    typingSessionRef.current++; // invalidate any in-flight typing
    setActivePaneIndex(0);
    setDisplayedCommand("");
    setDisplayedOutput("");
    setIsPaneTyping(false);
    setCompletedPanes(new Map());
  }, [panes]);

  // Clear on start screen
  useEffect(() => {
    if (isStartScreen) {
      setDisplayedCommand("");
      setDisplayedOutput("");
    }
  }, [isStartScreen]);

  // When parent triggers typing (new step advance)
  useEffect(() => {
    if (isTyping && panes && panes.length > 0) {
      startTypingPane(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  // Keyboard event for start screen
  useEffect(() => {
    if (isStartScreen && onStart) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Enter") onStart();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [isStartScreen, onStart]);

  // Typing effect — re-runs only when typingKey increments
  useEffect(() => {
    if (typingKey === 0) return;

    const session = typingSessionRef.current;
    const pane = panesRef.current?.[typingPaneIndexRef.current];
    if (!pane) return;

    setIsPaneTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (typingSessionRef.current !== session) {
        clearInterval(interval);
        return;
      }
      if (i <= pane.command.length) {
        setDisplayedCommand(pane.command.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (typingSessionRef.current !== session) return;
          setDisplayedOutput(pane.output);
          setIsPaneTyping(false);
          const idx = typingPaneIndexRef.current;
          setCompletedPanes((prev) => {
            const next = new Map(prev);
            next.set(idx, { command: pane.command, output: pane.output });
            return next;
          });
          if (idx === 0) onTypingCompleteRef.current?.();
        }, 500);
      }
    }, 4);

    return () => clearInterval(interval);
  }, [typingKey]);

  function startTypingPane(index: number) {
    typingPaneIndexRef.current = index;
    setActivePaneIndex(index);
    setDisplayedCommand("");
    setDisplayedOutput("");
    setTypingKey((k) => k + 1);
  }

  function handleTabClick(index: number) {
    if (index === activePaneIndex && isPaneTyping) return;
    const completed = completedPanes.get(index);
    if (completed) {
      setActivePaneIndex(index);
      setDisplayedCommand(completed.command);
      setDisplayedOutput(completed.output);
      setIsPaneTyping(false);
    } else {
      startTypingPane(index);
    }
  }

  const hasContent = !!(displayedCommand || displayedOutput);
  const showPaneContent = !isStartScreen && (hasContent || isPaneTyping);

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
          AegisPay CRE Terminal — Local Simulation
        </span>
      </div>

      {/* Pane Tabs */}
      {panes && panes.length > 0 && !isStartScreen && (
        <div className="bg-gray-950 border-b border-gray-800 flex overflow-x-auto">
          {panes.map((pane, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`px-4 py-2 text-xs font-mono whitespace-nowrap border-r border-gray-800 transition-colors flex items-center gap-1.5 ${
                activePaneIndex === index
                  ? "bg-gray-900 text-cyan-400 border-b-2 border-b-cyan-400"
                  : completedPanes.has(index)
                    ? "text-green-400/70 hover:text-green-400 hover:bg-gray-900/50 cursor-pointer"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 cursor-pointer"
              }`}
            >
              {completedPanes.has(index) && index !== activePaneIndex && (
                <span className="text-green-400 text-[10px]">✓</span>
              )}
              {pane.label}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm min-h-[400px]">
        {showPaneContent ? (
          <>
            {/* Command line */}
            {displayedCommand && (
              <div className="mb-2">
                <span className="text-green-400">$</span>
                <span className="text-white ml-2 break-all">
                  {displayedCommand}
                </span>
                {isPaneTyping && showCursor && (
                  <span className="text-green-400">█</span>
                )}
              </div>
            )}

            {/* Output */}
            {displayedOutput && (
              <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                {displayedOutput.split("\\n").map((line, index) => {
                  if (line.startsWith("✅"))
                    return (
                      <div key={index} className="text-green-400">
                        {line}
                      </div>
                    );
                  if (line.startsWith("🤖"))
                    return (
                      <div key={index} className="text-blue-400">
                        {line}
                      </div>
                    );
                  if (line.startsWith("💰") || line.startsWith("↩️"))
                    return (
                      <div key={index} className="text-cyan-400">
                        {line}
                      </div>
                    );
                  if (line.startsWith("📊") || line.startsWith("📋"))
                    return (
                      <div key={index} className="text-purple-400">
                        {line}
                      </div>
                    );
                  if (line.startsWith("📡"))
                    return (
                      <div key={index} className="text-yellow-400">
                        {line}
                      </div>
                    );
                  if (line.startsWith("🗄️"))
                    return (
                      <div key={index} className="text-blue-300">
                        {line}
                      </div>
                    );
                  if (line.startsWith("❌"))
                    return (
                      <div key={index} className="text-red-400 font-semibold">
                        {line}
                      </div>
                    );
                  if (line.startsWith("  └─")) {
                    const isWarning = line.includes("⚠️");
                    return (
                      <div
                        key={index}
                        className={`${isWarning ? "text-amber-400" : "text-gray-400"} pl-2`}
                      >
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
          </>
        ) : (
          /* Start screen / default prompt */
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
        )}
      </div>
    </div>
  );
}
