export const siteConfig = {
    name: "AegisPay",
    title: "AegisPay - Decentralized Settlement Layer for Web3 Commerce",
    description: "The off-chain intelligence powering Web3's Visa-style Auth & Capture payment protocol. Bringing institutional-grade smart contracts to the machine economy.",
    url: "https://aegispay.com",
    hero: {
        title: "The Decentralized Settlement Layer for Web3 Commerce & The Machine Economy",
        subtitle: "Bringing Visa-style 'Auth & Capture' to smart contracts. Powering dynamic pricing for DePIN, AI Agents, and real-world services with off-chain risk engines.",
        ctaText: "Enter Simulation Console",
        secondaryCta: "Watch Demo"
    },
    navigation: {
        main: [
            { name: "Demos", href: "/demos" },
            { name: "Transactions", href: "/transactions" },
            { name: "Documentation", href: "/docs" },
            { name: "GitHub", href: "https://github.com/AegisPayments", target: "_blank" }
        ]
    },
    features: [
        {
            title: "No Infinite Approvals",
            description: "Users deposit funds once into a secure singleton ledger. Merchants get time-limited authorizations for specific amounts without dangerous wallet access.",
            icon: "shield"
        },
        {
            title: "Zero-Friction Dynamic Pricing",
            description: "Dynamic services like ride-sharing and EV charging increment authorizations smoothly without over-collateralization or strict one time approvals.",
            icon: "zap"
        },
        {
            title: "AI Risk Engine",
            description: "Advanced Chainlink CRE workflows with LLM-powered fraud detection analyze every authorization increment to prevent abuse in real-time.",
            icon: "brain"
        }
    ],
    problems: [
        {
            title: "Infinite Approvals Risk",
            description: "Traditional ERC20 approvals force users into dangerous infinite approvals or suffer constant transaction friction."
        },
        {
            title: "Over-collateralization Burden",
            description: "Dynamic pricing services require users to lock excessive upfront capital. Want a $15 Uber? Lock $100 'just in case'."
        },
        {
            title: "Strict Approval UX Nightmare",
            description: "If an estimated $15 ride costs $16 due to traffic, the transaction reverts. Merchant fails, user experience breaks."
        }
    ],
    social: {
        github: "https://github.com/AegisPayments",
    }
}