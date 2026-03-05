export interface TerminalPane {
    label: string;
    command: string;
    output: string;
}

export interface DemoStep {
    id: number;
    title: string;
    description: string;
    userAction?: string;
    terminalPanes: TerminalPane[];
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
            userWallet: "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7",
            merchantWallet: "0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4",
            steps: [
                {
                    id: 1,
                    title: "Sign & Authorize Payment",
                    description: "User signs an EIP-712 off-chain authorization for the estimated charging session. The signed payload is forwarded to the CRE HTTP trigger which validates the signature, queries Firestore for user history, runs AI-powered fraud detection, and executes the authorization on-chain via Chainlink Forwarder. An authorization log is written to Firestore for full auditability.",
                    userAction: "User taps 'Start Charging'. The app signs the authorization message locally and forwards it to the Aegis CRE workflow for AI fraud assessment before locking funds on-chain.",
                    terminalPanes: [
                        {
                            label: "Sign Payload",
                            command: "cd testing && echo '{\\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"amount\\\": 20, \\\"nonce\\\": 1}' | node sig-gen-minimal.js",
                            output: "🔐 Generating EIP-712 signature...\\n📝 Domain: AegisPayProtocol v1.0.0\\n✅ Signature: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef12...\\n📋 Payload ready for authorize workflow"
                        },
                        {
                            label: "Run Authorize",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"authorize\\\", \\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"amount\\\": 20, \\\"nonce\\\": 1, \\\"signature\\\": \\\"0x1a2b3c4d...\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 CRE HTTP Trigger initiated...\\n🔐 Signature validation: PASSED\\n🗄️ Firebase query: User transaction history retrieved\\n🤖 LLM Fraud Detection: Analyzing EV_CHARGER pattern\\n  └─ Risk Level: LOW — Established user pattern\\n  └─ Amount $20.00 within normal EV charging range\\n  └─ Fraud Indicators: None detected\\n✅ Authorization APPROVED: $20.00\\n⚡ authorize() executed via Chainlink Forwarder\\n📊 Authorization log written to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$20.00",
                        balance: "$980.00",
                        status: "Charging Active",
                        actionStepTitle: "Start Charging — Authorize $20",
                        progress: 30
                    }
                },
                {
                    id: 2,
                    title: "AI Risk Engine: Session Extension",
                    description: "Slower-than-expected charging speed requires more authorization. The merchant submits a secureIncrement request through the Aegis AI Risk Engine. The LLM evaluates user history, merchant category (EV_CHARGER allows 50–200% variance), and fraud signals before approving the increment on-chain. The updated authorization is logged to Firestore for full auditability.",
                    userAction: "Charging station detects slower speed and requests a session extension. The Aegis AI Risk Engine evaluates the increment against EV_CHARGER variance limits and approves the on-chain adjustment.",
                    terminalPanes: [
                        {
                            label: "Secure Increment",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"secureIncrement\\\", \\\"merchantType\\\": \\\"EV_CHARGER\\\", \\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"currentAuth\\\": 20, \\\"requestedTotal\\\": 35, \\\"reason\\\": \\\"Slower charging speed — battery requires additional time\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 Secure increment workflow triggered\\n🗄️ Firebase context: Previous EV charging patterns analyzed\\n🤖 Aegis AI Risk Engine:\\n  └─ Merchant Type: EV_CHARGER (50–200% variance allowed)\\n  └─ Request: $20.00 → $35.00 (+75%)\\n  └─ User History: Consistent EV charging behavior\\n  └─ Fraud Indicators: None detected\\n✅ INCREMENT APPROVED: $35.00 total authorization\\n⚡ secureIncrement() executed via Chainlink Forwarder\\n📊 Updated authorization logged to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$35.00",
                        balance: "$965.00",
                        status: "Extended Session",
                        actionStepTitle: "Extend Session",
                        progress: 65
                    }
                },
                {
                    id: 3,
                    title: "Capture Funds & Release Excess",
                    description: "Session ends at $32.50 — less than the $35 authorized. The merchant captures $32.50 via captureFunds(). The smart contract automatically releases the remaining $2.50 back to the user's free balance. Both the Captured and FundsReleased on-chain events trigger CRE EVM log-based workflows that write to captured-logs and funds-released-logs Firestore collections, maintaining a perfect audit trail.",
                    userAction: "Vehicle unplugged. Merchant captures $32.50. Smart contract immediately releases $2.50 back to user. CRE EVM log triggers update Firestore captured-logs and funds-released-logs collections.",
                    terminalPanes: [
                        {
                            label: "Capture Funds",
                            command: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x9F77cBDb561aaD32b403695306e3eea53F9B40e7 AMOUNT=32500000 FLAGS=--broadcast",
                            output: "🔄 Executing captureFunds() on-chain...\\n✅ Transaction confirmed: 0xb356c6344b026a3ee5893baced116219beb3...\\n💰 Captured(user: 0x9F77..., merchant: 0x742d..., amount: 32500000)\\n↩️ FundsReleased(user: 0x9F77..., amount: 2500000)\\n📋 $32.50 captured · $2.50 released back to user"
                        },
                        {
                            label: "Index Events",
                            command: "cre workflow simulate ./aegis-workflow --non-interactive --trigger-index 1 --evm-tx-hash 0xb356c6344b026a3ee5893baced116219beb3bdfab7a6becffe1269d59161558e --evm-event-index 0 --target local-simulation",
                            output: "📡 EVM Log Trigger: Captured event detected\\n💰 Processing Captured(user: 0x9F77..., merchant: 0x742d..., amount: $32.50)\\n🗄️ captured-logs collection → Firestore write complete\\n📡 EVM Log Trigger: FundsReleased event detected\\n↩️ Processing FundsReleased(user: 0x9F77..., amount: $2.50)\\n🗄️ funds-released-logs collection → Firestore write complete\\n✅ Audit trail complete: On-chain events synced to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$967.50",
                        status: "Session Complete",
                        actionStepTitle: "End Session — Pay $32.50",
                        progress: 100
                    }
                }
            ]
        },
        {
            id: "ride-sharing",
            title: "Ride Sharing Service",
            description: "Dynamic ride pricing with AI risk assessment for traffic delays and route adjustments",
            merchantType: "RIDE_SHARE",
            userWallet: "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7",
            merchantWallet: "0x8F88cBDb561aaD32b403695306e3eea53F9B50f8",
            steps: [
                {
                    id: 1,
                    title: "Sign & Authorize Ride",
                    description: "User signs an EIP-712 off-chain authorization for the estimated fare. The CRE workflow validates the signature, queries Firestore for user ride history, runs AI-powered fraud detection, and executes the authorization on-chain via Chainlink Forwarder. An authorization log is written to Firestore for full auditability.",
                    userAction: "User confirms the ride booking. The app signs the $18 authorization and forwards it to the Aegis CRE workflow for AI fraud assessment before locking funds on-chain.",
                    terminalPanes: [
                        {
                            label: "Sign Payload",
                            command: "cd testing && echo '{\\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x8F88cBDb561aaD32b403695306e3eea53F9B50f8\\\", \\\"amount\\\": 18, \\\"nonce\\\": 1}' | node sig-gen-minimal.js",
                            output: "🔐 Generating EIP-712 signature...\\n📝 Domain: AegisPayProtocol v1.0.0\\n✅ Signature: 0x2b3c4d5e6f7890abcdef1234567890abcdef12...\\n📋 Payload ready for authorize workflow"
                        },
                        {
                            label: "Run Authorize",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"authorize\\\", \\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x8F88cBDb561aaD32b403695306e3eea53F9B50f8\\\", \\\"amount\\\": 18, \\\"nonce\\\": 1, \\\"signature\\\": \\\"0x2b3c4d...\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 CRE HTTP Trigger initiated...\\n🔐 Signature validation: PASSED\\n🗄️ Firebase query: User ride history — 15 previous trips\\n🤖 LLM Fraud Detection: Analyzing RIDE_SHARE pattern\\n  └─ Risk Level: LOW — Established ride-share user\\n  └─ Amount $18.00 within normal fare range\\n  └─ Fraud Indicators: None detected\\n✅ Authorization APPROVED: $18.00\\n⚡ authorize() executed via Chainlink Forwarder\\n📊 Authorization log written to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$18.00",
                        balance: "$982.00",
                        status: "Ride Authorized",
                        actionStepTitle: "Book Ride — Authorize $18",
                        progress: 30
                    }
                },
                {
                    id: 2,
                    title: "AI Risk Engine: Route Adjustment",
                    description: "Heavy traffic requires a fare increment. The driver submits a secureIncrement request through the Aegis AI Risk Engine. The LLM evaluates user ride history, RIDE_SHARE variance limits (up to 50%), and fraud indicators before approving the adjustment on-chain. The updated authorization is logged to Firestore for full auditability.",
                    userAction: "Driver encounters major traffic and requests a fare adjustment. The Aegis AI Risk Engine evaluates the increment against RIDE_SHARE category limits and approves the on-chain adjustment.",
                    terminalPanes: [
                        {
                            label: "Secure Increment",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"secureIncrement\\\", \\\"merchantType\\\": \\\"RIDE_SHARE\\\", \\\"user\\\": \\\"0x9F77cBDb561aaD32b403695306e3eea53F9B40e7\\\", \\\"merchant\\\": \\\"0x8F88cBDb561aaD32b403695306e3eea53F9B50f8\\\", \\\"currentAuth\\\": 18, \\\"requestedTotal\\\": 30, \\\"reason\\\": \\\"Major traffic on I-95 — alternate route adds 12 miles\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 Secure increment workflow triggered\\n🗄️ Firebase context: Previous ride patterns analyzed\\n🤖 Aegis AI Risk Engine:\\n  └─ Merchant Type: RIDE_SHARE (up to 50% variance allowed)\\n  └─ Request: $18.00 → $30.00 (+67% — within limits)\\n  └─ User History: Accepts traffic-based adjustments\\n  └─ Fraud Indicators: None detected\\n✅ INCREMENT APPROVED: $30.00 total authorization\\n⚡ secureIncrement() executed via Chainlink Forwarder\\n📊 Updated authorization logged to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$30.00",
                        balance: "$970.00",
                        status: "Route Adjusted",
                        actionStepTitle: "Accept Route Change",
                        progress: 65
                    }
                },
                {
                    id: 3,
                    title: "Capture Funds & Release Excess",
                    description: "Ride ends at $26 — less than the $30 authorized after the route change. The merchant captures $26 via captureFunds(). The smart contract automatically releases $4 back to the user's free balance. Both the Captured and FundsReleased on-chain events trigger CRE EVM log workflows that write to captured-logs and funds-released-logs Firestore collections.",
                    userAction: "Passenger exits early. Merchant captures $26. Smart contract immediately releases $4 back to user. CRE EVM log triggers update Firestore captured-logs and funds-released-logs.",
                    terminalPanes: [
                        {
                            label: "Capture Funds",
                            command: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x9F77cBDb561aaD32b403695306e3eea53F9B40e7 AMOUNT=26000000 FLAGS=--broadcast",
                            output: "🔄 Executing captureFunds() on-chain...\\n✅ Transaction confirmed: 0xf247d1c4567b8e3c4f8b9e4d5c6a7b8e9f0a1b2...\\n💰 Captured(user: 0x9F77..., merchant: 0x8F88..., amount: 26000000)\\n↩️ FundsReleased(user: 0x9F77..., amount: 4000000)\\n📋 $26.00 captured · $4.00 released back to user"
                        },
                        {
                            label: "Index Events",
                            command: "cre workflow simulate ./aegis-workflow --non-interactive --trigger-index 1 --evm-tx-hash 0xf247d1c4567b8e3c4f8b9e4d5c6a7b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5 --evm-event-index 0 --target local-simulation",
                            output: "📡 EVM Log Trigger: Captured event detected\\n💰 Processing Captured(user: 0x9F77..., merchant: 0x8F88..., amount: $26.00)\\n🗄️ captured-logs collection → Firestore write complete\\n📡 EVM Log Trigger: FundsReleased event detected\\n↩️ Processing FundsReleased(user: 0x9F77..., amount: $4.00)\\n🗄️ funds-released-logs collection → Firestore write complete\\n✅ Audit trail complete: On-chain events synced to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$974.00",
                        status: "Trip Complete",
                        actionStepTitle: "End Ride — Pay $26",
                        progress: 100
                    }
                }
            ]
        },
        {
            id: "ai-agent",
            title: "AI Agent Request",
            description: "Autonomous AI agent requesting compute resources with dynamic scaling and usage-based billing",
            merchantType: "GENERIC",
            userWallet: "0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4",
            merchantWallet: "0x7G99dBDb561aaD32b403695306e3eea53F9C61g9",
            steps: [
                {
                    id: 1,
                    title: "Sign & Authorize Compute",
                    description: "AI agent signs an EIP-712 off-chain authorization for the initial compute batch. The CRE workflow validates the signature, queries Firestore for agent usage history, runs AI-powered fraud detection, and executes the authorization on-chain via Chainlink Forwarder. An authorization log is written to Firestore for full auditability.",
                    userAction: "AI agent automatically requests compute resources. The authorization is signed and forwarded to the Aegis CRE workflow for fraud assessment before locking funds on-chain.",
                    terminalPanes: [
                        {
                            label: "Sign Payload",
                            command: "cd testing && echo '{\\\"user\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"merchant\\\": \\\"0x7G99dBDb561aaD32b403695306e3eea53F9C61g9\\\", \\\"amount\\\": 5, \\\"nonce\\\": 1}' | node sig-gen-minimal.js",
                            output: "🔐 Generating EIP-712 signature...\\n📝 Domain: AegisPayProtocol v1.0.0\\n✅ Signature: 0x9abc3c4d5e6f7890abcdef1234567890abcdef12...\\n📋 Payload ready for authorize workflow"
                        },
                        {
                            label: "Run Authorize",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"authorize\\\", \\\"user\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"merchant\\\": \\\"0x7G99dBDb561aaD32b403695306e3eea53F9C61g9\\\", \\\"amount\\\": 5, \\\"nonce\\\": 1, \\\"signature\\\": \\\"0x9abc3c4d...\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 CRE HTTP Trigger initiated...\\n🔐 Signature validation: PASSED\\n🗄️ Firebase query: Agent usage history retrieved\\n🤖 LLM Fraud Detection: Analyzing GENERIC pattern\\n  └─ Risk Level: LOW — Established agent usage pattern\\n  └─ Amount $5.00 within normal compute range\\n  └─ Fraud Indicators: None detected\\n✅ Authorization APPROVED: $5.00\\n⚡ authorize() executed via Chainlink Forwarder\\n📊 Authorization log written to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$5.00",
                        balance: "$995.00",
                        status: "Processing Data",
                        actionStepTitle: "Authorize Compute — $5",
                        progress: 30
                    }
                },
                {
                    id: 2,
                    title: "AI Risk Engine: Resource Scaling",
                    description: "Complex analysis requires additional GPU compute. The agent submits a secureIncrement request through the Aegis AI Risk Engine. The LLM evaluates agent usage patterns, GENERIC category variance limits, and fraud signals before approving the scaling on-chain. The updated authorization is logged to Firestore for full auditability.",
                    userAction: "Agent detects it needs more compute for complex data analysis. The Aegis AI Risk Engine evaluates the increment request against GENERIC category limits and approves the on-chain adjustment.",
                    terminalPanes: [
                        {
                            label: "Secure Increment",
                            command: "cre workflow simulate ./aegis-workflow --http-payload '{\\\"functionName\\\": \\\"secureIncrement\\\", \\\"merchantType\\\": \\\"GENERIC\\\", \\\"user\\\": \\\"0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4\\\", \\\"merchant\\\": \\\"0x7G99dBDb561aaD32b403695306e3eea53F9C61g9\\\", \\\"currentAuth\\\": 5, \\\"requestedTotal\\\": 8, \\\"reason\\\": \\\"Additional GPU compute required for complex analysis\\\"}' --target local-simulation --non-interactive --trigger-index 0",
                            output: "🔄 Secure increment workflow triggered\\n🗄️ Firebase context: Previous agent usage patterns analyzed\\n🤖 Aegis AI Risk Engine:\\n  └─ Merchant Type: GENERIC (low variance threshold)\\n  └─ Request: $5.00 → $8.00 (+60% — within limits)\\n  └─ User History: Consistent compute scaling behavior\\n  └─ Fraud Indicators: None detected\\n✅ INCREMENT APPROVED: $8.00 total authorization\\n⚡ secureIncrement() executed via Chainlink Forwarder\\n📊 Updated authorization logged to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$8.00",
                        balance: "$992.00",
                        status: "High Compute Mode",
                        actionStepTitle: "Scale Resources",
                        progress: 65
                    }
                },
                {
                    id: 3,
                    title: "Capture Funds & Release Excess",
                    description: "Task completes using $7.25 — less than the $8 authorized. The merchant captures $7.25 via captureFunds(). The smart contract automatically releases $0.75 back to the user. Both the Captured and FundsReleased on-chain events trigger CRE EVM log workflows that write to captured-logs and funds-released-logs Firestore collections, maintaining a perfect audit trail.",
                    userAction: "Agent completes analysis. Merchant captures $7.25. Smart contract releases $0.75 back to user. CRE EVM log triggers update Firestore captured-logs and funds-released-logs collections.",
                    terminalPanes: [
                        {
                            label: "Capture Funds",
                            command: "make capture-funds PROTOCOL=0xProtocolAddress USER_ADDRESS=0x742d35Cc6B4c6534F7c9b156dfDD3B29A5c9E0a4 AMOUNT=7250000 FLAGS=--broadcast",
                            output: "🔄 Executing captureFunds() on-chain...\\n✅ Transaction confirmed: 0xa1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4...\\n💰 Captured(user: 0x742d..., merchant: 0x7G99..., amount: 7250000)\\n↩️ FundsReleased(user: 0x742d..., amount: 750000)\\n📋 $7.25 captured · $0.75 released back to user"
                        },
                        {
                            label: "Index Events",
                            command: "cre workflow simulate ./aegis-workflow --non-interactive --trigger-index 1 --evm-tx-hash 0xa1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90 --evm-event-index 0 --target local-simulation",
                            output: "📡 EVM Log Trigger: Captured event detected\\n💰 Processing Captured(user: 0x742d..., merchant: 0x7G99..., amount: $7.25)\\n🗄️ captured-logs collection → Firestore write complete\\n📡 EVM Log Trigger: FundsReleased event detected\\n↩️ Processing FundsReleased(user: 0x742d..., amount: $0.75)\\n🗄️ funds-released-logs collection → Firestore write complete\\n✅ Audit trail complete: On-chain events synced to Firestore"
                        }
                    ],
                    appState: {
                        currentAuth: "$0.00",
                        balance: "$992.75",
                        status: "Task Complete",
                        actionStepTitle: "Complete Task — Pay $7.25",
                        progress: 100
                    }
                }
            ]
        }
    ]
}
