export interface DemoStep {
    id: number;
    title: string;
    description: string;
    terminalCommand?: string;
    terminalOutput?: string;
    userAction?: string;
    appState?: {
        currentAuth?: string;
        balance?: string;
        status?: string;
        actionStepTitle: string;
        progress?: number;
    };
}

export interface DemoScenario {
    id: string;
    title: string;
    description: string;
    merchantType: string;
    userWallet: string;
    merchantWallet: string;
    steps: DemoStep[];
}

type TDemoConfig = {
    scenarios: DemoScenario[];
}

export const demoConfig: TDemoConfig = {
    scenarios: [
        {
            id: "ev-charging",
            title: "EV Charging Station",
            description: "Dynamic charging session with real-time authorization adjustments based on battery capacity and charging speed",
            merchantType: "EV_CHARGER",
            userWallet: "0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4",
            merchantWallet: "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7",
            steps: [
                {
                    id: 1,
                    title: "Initial Authorization",
                    description: "User authorizes $20 for EV charging session",
                    userAction: "Tap 'Start Charging' in app",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"authorize\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\", \"amount\": 20, \"nonce\": 1, \"signature\": \"0x1234...\"}' --target local-simulation",
                    terminalOutput: "✅ Authorization approved: $20.00\\n📊 AI Risk Assessment: LOW (Standard EV charging pattern)\\n⚡ Contract execution successful\\n🔒 Funds secured in authorization hold",
                    appState: {
                        currentAuth: "$20.00",
                        balance: "$980.00",
                        status: "Charging Active",
                        actionStepTitle: "Start Charging",
                        progress: 10
                    }
                },
                {
                    id: 2,
                    title: "Mid-Session Adjustment",
                    description: "Charging station requests additional $15 due to slower charging speed",
                    userAction: "System automatically evaluates increment request",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"secureIncrement\", \"merchantType\": \"EV_CHARGER\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\", \"currentAuth\": 20, \"requestedTotal\": 35, \"reason\": \"Slower charging speed detected\"}' --target local-simulation",
                    terminalOutput: "🤖 LLM Risk Engine Analysis:\\n✅ Historical pattern: Normal for this user\\n✅ Variance within EV_CHARGER limits (75% increase allowed)\\n✅ Increment approved: $35.00 total authorization\\n⚡ Smart contract updated",
                    appState: {
                        currentAuth: "$35.00",
                        balance: "$965.00",
                        status: "Charging Active",
                        actionStepTitle: "Charging Adjustment Approved",
                        progress: 60
                    }
                },
                {
                    id: 3,
                    title: "Session Complete",
                    description: "Charging complete, merchant captures $32.50, remaining $2.50 released",
                    userAction: "Unplug vehicle from charger",
                    terminalCommand: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4 AMOUNT=32500000 --broadcast",
                    terminalOutput: "💰 Funds captured: $32.50\\n↩️ Unused authorization released: $2.50\\n📋 Transaction logged to Firestore\\n✅ Session complete",
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$967.50",
                        status: "Session Complete",
                        actionStepTitle: "Session Complete",
                        progress: 100
                    }
                }
            ]
        },
        {
            id: "ride-sharing",
            title: "Ride Sharing Service",
            description: "Dynamic ride pricing with traffic delays and route adjustments",
            merchantType: "RIDE_SHARE",
            userWallet: "0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4",
            merchantWallet: "0x8F88cBDb561aaD32b403695306e3eea53F9B50f8",
            steps: [
                {
                    id: 1,
                    title: "Ride Authorization",
                    description: "User authorizes estimated $18 for ride to airport",
                    userAction: "Confirm ride booking in app",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"authorize\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x8F88cBDb561aaD32b403695306e3eea53F9B50f8\", \"amount\": 18, \"nonce\": 2, \"signature\": \"0x5678...\"}' --target local-simulation",
                    terminalOutput: "✅ Ride authorization approved: $18.00\\n📊 AI Risk Assessment: LOW (Standard ride pattern)\\n🚗 Driver assigned, route calculated\\n🔒 Payment secured",
                    appState: {
                        currentAuth: "$18.00",
                        balance: "$949.50",
                        status: "Driver En Route",
                        actionStepTitle: "Driver En Route",
                        progress: 15
                    }
                },
                {
                    id: 2,
                    title: "Traffic Delay Adjustment",
                    description: "Heavy traffic requires route change, increasing fare to $24",
                    userAction: "Driver navigates alternate route",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"secureIncrement\", \"merchantType\": \"RIDE_SHARE\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x8F88cBDb561aaD32b403695306e3eea53F9B50f8\", \"currentAuth\": 18, \"requestedTotal\": 24, \"reason\": \"Traffic delay requiring alternate route\"}' --target local-simulation",
                    terminalOutput: "🤖 LLM Risk Engine Analysis:\\n✅ Traffic delay typical for this route\\n✅ 33% increase within RIDE_SHARE limits\\n✅ User history shows similar adjustments\\n✅ Increment approved: $24.00 total",
                    appState: {
                        currentAuth: "$24.00",
                        balance: "$943.50",
                        status: "In Transit",
                        actionStepTitle: "Fare Adjustment Approved",
                        progress: 70
                    }
                },
                {
                    id: 3,
                    title: "Ride Complete",
                    description: "Arrived at destination, final fare $23.50 with tip",
                    userAction: "Exit vehicle at destination",
                    terminalCommand: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4 AMOUNT=23500000 --broadcast",
                    terminalOutput: "💰 Ride payment captured: $23.50\\n↩️ Unused authorization released: $0.50\\n⭐ Trip completed successfully\\n📱 Receipt sent to user",
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$944.00",
                        status: "Trip Complete",
                        actionStepTitle: "Trip Complete",
                        progress: 100
                    }
                }
            ]
        },
        {
            id: "ai-agent",
            title: "AI Agent Request",
            description: "Autonomous AI agent requesting compute resources with dynamic scaling",
            merchantType: "GENERIC",
            userWallet: "0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4",
            merchantWallet: "0x7G99dBDb561aaD32b403695306e3eea53F9C61g9",
            steps: [
                {
                    id: 1,
                    title: "Agent Authorization",
                    description: "AI agent requests $5 for initial compute batch",
                    userAction: "AI agent automatically requests resources",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"authorize\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x7G99dBDb561aaD32b403695306e3eea53F9C61g9\", \"amount\": 5, \"nonce\": 3, \"signature\": \"0x9abc...\"}' --target local-simulation",
                    terminalOutput: "✅ AI Agent authorization approved: $5.00\\n🤖 Agent: GPT-4 Data Analysis Pipeline\\n📊 Risk Assessment: LOW (Established agent patterns)\\n⚡ Compute resources allocated",
                    appState: {
                        currentAuth: "$5.00",
                        balance: "$939.00",
                        status: "Processing Data",
                        actionStepTitle: "Processing Data",
                        progress: 20
                    }
                },
                {
                    id: 2,
                    title: "Resource Scaling",
                    description: "Agent requires additional compute for complex analysis",
                    userAction: "Agent automatically scales resources",
                    terminalCommand: "cre workflow simulate ./aegis-workflow --http-payload '{\"functionName\": \"secureIncrement\", \"merchantType\": \"GENERIC\", \"user\": \"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\", \"merchant\": \"0x7G99dBDb561aaD32b403695306e3eea53F9C61g9\", \"currentAuth\": 5, \"requestedTotal\": 8, \"reason\": \"Additional GPU compute required for analysis\"}' --target local-simulation",
                    terminalOutput: "🤖 LLM Risk Engine Analysis:\\n✅ Legitimate AI agent behavior\\n✅ 60% increase within GENERIC limits\\n✅ Compute scaling pattern recognized\\n✅ Increment approved: $8.00 total",
                    appState: {
                        currentAuth: "$8.00",
                        balance: "$936.00",
                        status: "High Compute Mode",
                        actionStepTitle: "Compute Scaling Approved",
                        progress: 85
                    }
                },
                {
                    id: 3,
                    title: "Task Complete",
                    description: "Agent completes analysis, actual usage $7.25",
                    userAction: "AI agent delivers results",
                    terminalCommand: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4 AMOUNT=7250000 --broadcast",
                    terminalOutput: "💰 Agent payment captured: $7.25\\n↩️ Unused authorization released: $0.75\\n📋 Analysis results delivered\\n🤖 Agent task completed",
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$936.75",
                        status: "Task Complete",
                        actionStepTitle: "Task Complete",
                        progress: 100
                    }
                }
            ]
        }
    ]
}