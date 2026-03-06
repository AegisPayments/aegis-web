"use client";

import { useState, useEffect } from "react";
import { Header } from "@/src/components/header";
import { Footer } from "@/src/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  X,
  Plus,
} from "lucide-react";

// Firestore interface types (as provided)
export interface FirestoreRiskLogData {
  fields: {
    userAddress: { stringValue: string };
    merchantAddress: { stringValue: string };
    merchantType: { stringValue: string };
    currentAuth: { integerValue: number };
    requestedTotal: { integerValue: number };
    reason: { stringValue: string };
    authorizationLogId: { stringValue: string };
    riskDecision: { stringValue: string };
    confidence: { integerValue: number };
    txHash: { stringValue: string };
    llmResponse: { stringValue: string };
    responseId: { stringValue: string };
    rawJsonString: { stringValue: string };
    createdAt: { integerValue: number };
  };
}

export interface FirestoreAuthorizeLogData {
  fields: {
    userAddress: { stringValue: string };
    merchantAddress: { stringValue: string };
    merchantType: { stringValue: string };
    amount: { integerValue: number };
    nonce: { integerValue: number };
    signature: { stringValue: string };
    fraudDecision: { stringValue: string };
    fraudConfidence: { integerValue: number };
    txHash: { stringValue: string };
    functionName: { stringValue: string };
    createdAt: { integerValue: number };
  };
}

export interface FirestoreCapturedLogData {
  fields: {
    userAddress: { stringValue: string };
    merchantAddress: { stringValue: string };
    amount: { integerValue: number };
    txHash: { stringValue: string };
    blockNumber: { stringValue: string };
    transactionHash: { stringValue: string };
    logIndex: { integerValue: number };
    createdAt: { integerValue: number };
  };
}

export interface FirestoreFundsReleasedLogData {
  fields: {
    userAddress: { stringValue: string };
    merchantAddress: { stringValue: string };
    amount: { integerValue: number };
    txHash: { stringValue: string };
    blockNumber: { stringValue: string };
    transactionHash: { stringValue: string };
    logIndex: { integerValue: number };
    createdAt: { integerValue: number };
  };
}

// Simplified interfaces for display
interface RiskLog {
  id: string;
  userAddress: string;
  merchantAddress: string;
  merchantType: string;
  currentAuth: number;
  requestedTotal: number;
  reason: string;
  riskDecision: string;
  confidence: number;
  txHash: string;
  createdAt: number;
}

interface AuthorizeLog {
  id: string;
  userAddress: string;
  merchantAddress: string;
  merchantType: string;
  amount: number;
  nonce: number;
  signature: string;
  fraudDecision: string;
  fraudConfidence: number;
  txHash: string;
  functionName: string;
  createdAt: number;
}

interface CapturedLog {
  id: string;
  userAddress: string;
  merchantAddress: string;
  amount: number;
  txHash: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
  createdAt: number;
}

interface FundsReleasedLog {
  id: string;
  userAddress: string;
  merchantAddress: string;
  amount: number;
  txHash: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
  createdAt: number;
}

const FIRESTORE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID || "aegispay-demo";

interface SearchFilter {
  id: string;
  field: string;
  value: string;
  label: string;
}

function WithCopyToClipBoard({
  text,
  color = "text-blue-400",
}: {
  text: string;
  color?: string;
}) {
  const formatAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
      })
      .catch((err) => {
        console.warn("Failed to copy:", err);
      });
  };

  const getHoverColor = (baseColor: string) => {
    if (baseColor.includes("blue")) return "hover:text-blue-400";
    if (baseColor.includes("green")) return "hover:text-green-400";
    if (baseColor.includes("orange")) return "hover:text-orange-400";
    return "hover:text-blue-400";
  };

  return (
    <>
      <code className={`${color} text-xs`}>{formatAddress(text)}</code>
      <button
        onClick={() => copyToClipboard(text)}
        className={`text-gray-500 ${getHoverColor(color)} transition-colors`}
        title="Copy full address"
      >
        <Copy className="w-3 h-3" />
      </button>
    </>
  );
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("authorization-logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [riskLogs, setRiskLogs] = useState<RiskLog[]>([]);
  const [authLogs, setAuthLogs] = useState<AuthorizeLog[]>([]);
  const [capturedLogs, setCapturedLogs] = useState<CapturedLog[]>([]);
  const [releasedLogs, setReleasedLogs] = useState<FundsReleasedLog[]>([]);

  // Convert Firestore document to simplified format
  const convertFirestoreDoc = (doc: any, type: string) => {
    const id = doc.name?.split("/").pop() || "unknown";
    const fields = doc.fields;

    if (type === "risk") {
      return {
        id,
        userAddress: fields.userAddress?.stringValue || "",
        merchantAddress: fields.merchantAddress?.stringValue || "",
        merchantType: fields.merchantType?.stringValue || "",
        currentAuth: fields.currentAuth?.integerValue || 0,
        requestedTotal: fields.requestedTotal?.integerValue || 0,
        reason: fields.reason?.stringValue || "",
        riskDecision: fields.riskDecision?.stringValue || "",
        confidence: fields.confidence?.integerValue || 0,
        txHash: fields.txHash?.stringValue || "",
        createdAt: fields.createdAt?.integerValue || 0,
      };
    } else if (type === "auth") {
      return {
        id,
        userAddress: fields.userAddress?.stringValue || "",
        merchantAddress: fields.merchantAddress?.stringValue || "",
        merchantType: fields.merchantType?.stringValue || "",
        amount: fields.amount?.integerValue || 0,
        nonce: fields.nonce?.integerValue || 0,
        signature: fields.signature?.stringValue || "",
        fraudDecision: fields.fraudDecision?.stringValue || "",
        fraudConfidence: fields.fraudConfidence?.integerValue || 0,
        txHash: fields.txHash?.stringValue || "",
        functionName: fields.functionName?.stringValue || "",
        createdAt: fields.createdAt?.integerValue || 0,
      };
    } else if (type === "captured") {
      return {
        id,
        userAddress: fields.userAddress?.stringValue || "",
        merchantAddress: fields.merchantAddress?.stringValue || "",
        amount: fields.amount?.integerValue || 0,
        txHash: fields.txHash?.stringValue || "",
        blockNumber: fields.blockNumber?.stringValue || "",
        transactionHash: fields.transactionHash?.stringValue || "",
        logIndex: fields.logIndex?.integerValue || 0,
        createdAt: fields.createdAt?.integerValue || 0,
      };
    } else if (type === "released") {
      return {
        id,
        userAddress: fields.userAddress?.stringValue || "",
        merchantAddress: fields.merchantAddress?.stringValue || "",
        amount: fields.amount?.integerValue || 0,
        txHash: fields.txHash?.stringValue || "",
        blockNumber: fields.blockNumber?.stringValue || "",
        transactionHash: fields.transactionHash?.stringValue || "",
        logIndex: fields.logIndex?.integerValue || 0,
        createdAt: fields.createdAt?.integerValue || 0,
      };
    }
  };

  const fetchFirestoreData = async (collection: string, type: string) => {
    try {
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/${collection}?orderBy=createdAt%20desc&pageSize=50`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            `Collection ${collection} not found - returning empty data`,
          );
          return [];
        }
        console.warn(
          `Failed to fetch ${collection}: ${response.status} ${response.statusText}`,
        );
        return [];
      }

      const data = await response.json();
      return (
        data.documents?.map((doc: any) => convertFirestoreDoc(doc, type)) || []
      );
    } catch (error) {
      console.warn(`Error fetching ${collection}:`, error);
      return [];
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [riskData, authData, capturedData, releasedData] =
        await Promise.all([
          fetchFirestoreData("risk-logs", "risk"),
          fetchFirestoreData("authorization-logs", "auth"),
          fetchFirestoreData("captured-logs", "captured"),
          fetchFirestoreData("funds-released-logs", "released"),
        ]);

      setRiskLogs(riskData);
      setAuthLogs(authData);
      setCapturedLogs(capturedData);
      setReleasedLogs(releasedData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const formatAmount = (amount: number) => {
    return (amount / 1e18).toFixed(6); // Assuming 18 decimal places
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getRiskBadgeVariant = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRiskIcon = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filterData = (data: any[], fields: string[]) => {
    let filteredData = data;

    // Apply search term filter
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        fields.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        ),
      );
    }

    // Apply specific field filters
    searchFilters.forEach((filter) => {
      filteredData = filteredData.filter((item) =>
        String(item[filter.field] || "")
          .toLowerCase()
          .includes(filter.value.toLowerCase()),
      );
    });

    return filteredData;
  };

  const addSearchFilter = () => {
    if (selectedField && filterValue) {
      const newFilter: SearchFilter = {
        id: Date.now().toString(),
        field: selectedField,
        value: filterValue,
        label: `${selectedField}: ${filterValue}`,
      };
      setSearchFilters([...searchFilters, newFilter]);
      setSelectedField("");
      setFilterValue("");
      setShowAddFilter(false);
    }
  };

  const removeSearchFilter = (id: string) => {
    setSearchFilters(searchFilters.filter((f) => f.id !== id));
  };

  const clearAllFilters = () => {
    setSearchFilters([]);
    setSearchTerm("");
  };

  const getSmartSearchResults = () => {
    const allData = {
      "risk-logs": {
        data: riskLogs,
        fields: [
          "userAddress",
          "merchantAddress",
          "merchantType",
          "reason",
          "riskDecision",
        ],
      },
      "authorization-logs": {
        data: authLogs,
        fields: [
          "userAddress",
          "merchantAddress",
          "merchantType",
          "functionName",
          "fraudDecision",
          "txHash",
        ],
      },
      "captured-logs": {
        data: capturedLogs,
        fields: ["userAddress", "merchantAddress", "txHash", "transactionHash"],
      },
      "released-logs": {
        data: releasedLogs,
        fields: ["userAddress", "merchantAddress", "txHash", "transactionHash"],
      },
    };

    const results = Object.entries(allData).map(([tab, config]) => ({
      tab,
      results: filterData(config.data, config.fields),
      total: config.data.length,
    }));

    const hasActiveFilter = searchTerm || searchFilters.length > 0;
    const bestMatch = hasActiveFilter
      ? results.find((r) => r.results.length > 0)
      : null;

    if (
      bestMatch &&
      hasActiveFilter &&
      bestMatch.tab !== activeTab &&
      bestMatch.results.length > 0
    ) {
      return bestMatch;
    }

    return null;
  };

  const smartSearchResult = getSmartSearchResults();

  const filteredRiskLogs = filterData(riskLogs, [
    "userAddress",
    "merchantAddress",
    "merchantType",
    "reason",
    "riskDecision",
  ]);
  const filteredAuthLogs = filterData(authLogs, [
    "userAddress",
    "merchantAddress",
    "merchantType",
    "functionName",
    "fraudDecision",
    "txHash",
  ]);
  const filteredCapturedLogs = filterData(capturedLogs, [
    "userAddress",
    "merchantAddress",
    "txHash",
    "transactionHash",
  ]);
  const filteredReleasedLogs = filterData(releasedLogs, [
    "userAddress",
    "merchantAddress",
    "txHash",
    "transactionHash",
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                Live Transactions
              </h1>
              <p className="text-gray-400">
                Real-time transaction monitoring across the AegisPay protocol
              </p>
            </div>
            <Button
              onClick={loadAllData}
              disabled={isLoading}
              className="bg-white text-black hover:bg-gray-200"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Smart Search Notification */}
        {smartSearchResult && (
          <Card className="mb-4 bg-blue-900/20 border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">
                    Found {smartSearchResult.results.length} result(s) in{" "}
                    {smartSearchResult.tab.replace("-", " ")}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab(smartSearchResult.tab)}
                  className="border-blue-800 text-blue-400 hover:bg-blue-900/50"
                >
                  Switch to Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <Card className="mb-6 bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by address, hash, type, or decision..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={() => setShowAddFilter(!showAddFilter)}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Filter
                </Button>
                {(searchTerm || searchFilters.length > 0) && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Add Filter Controls */}
              {showAddFilter && (
                <div className="flex gap-2 p-4 bg-gray-800/50 rounded-md">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                  >
                    <option value="">Select field...</option>
                    <option value="userAddress">User Address</option>
                    <option value="merchantAddress">Merchant Address</option>
                    <option value="merchantType">Merchant Type</option>
                    <option value="functionName">Function Name</option>
                    <option value="riskDecision">Risk Decision</option>
                    <option value="txHash">Transaction Hash</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Filter value..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 text-sm"
                  />
                  <Button
                    onClick={addSearchFilter}
                    size="sm"
                    disabled={!selectedField || !filterValue}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Add
                  </Button>
                </div>
              )}

              {/* Active Filters */}
              {searchFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchFilters.map((filter) => (
                    <Badge
                      key={filter.id}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-700 text-gray-200"
                    >
                      {filter.label}
                      <button
                        onClick={() => removeSearchFilter(filter.id)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-gray-900/50 border border-gray-800 rounded-lg p-1">
            <TabsTrigger
              value="authorization-logs"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Zap className="w-4 h-4" />
              Authorizations
            </TabsTrigger>
            <TabsTrigger
              value="risk-logs"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Shield className="w-4 h-4" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger
              value="captured-logs"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Lock className="w-4 h-4" />
              Captures
            </TabsTrigger>
            <TabsTrigger
              value="released-logs"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Unlock className="w-4 h-4" />
              Releases
            </TabsTrigger>
          </TabsList>

          {/* Risk Logs Tab */}
          <TabsContent value="risk-logs" className="mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Risk Assessment Logs
                  </div>
                  <div className="text-sm text-gray-400">
                    {searchTerm || searchFilters.length > 0 ? (
                      <>
                        Showing {filteredRiskLogs.length} of {riskLogs.length}{" "}
                        results
                      </>
                    ) : (
                      <>{riskLogs.length} total</>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-3 text-gray-400">Doc ID</th>
                        <th className="text-left p-3 text-gray-400">Time</th>
                        <th className="text-left p-3 text-gray-400">User</th>
                        <th className="text-left p-3 text-gray-400">
                          Merchant
                        </th>
                        <th className="text-left p-3 text-gray-400">Type</th>
                        <th className="text-left p-3 text-gray-400">Amount</th>
                        <th className="text-left p-3 text-gray-400">
                          Decision
                        </th>
                        <th className="text-left p-3 text-gray-400">
                          Confidence
                        </th>
                        <th className="text-left p-3 text-gray-400">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRiskLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.id}
                                color="text-gray-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.userAddress}
                                color="text-blue-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.merchantAddress}
                                color="text-green-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {log.merchantType}
                            </Badge>
                          </td>
                          <td className="p-3 text-yellow-400">
                            {formatAmount(log.requestedTotal)} ETH
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getRiskIcon(log.riskDecision)}
                              <Badge
                                variant={getRiskBadgeVariant(log.riskDecision)}
                              >
                                {log.riskDecision}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-purple-400">
                            {log.confidence}%
                          </td>
                          <td className="p-3 text-gray-300 max-w-xs truncate">
                            {log.reason}
                          </td>
                        </tr>
                      ))}
                      {filteredRiskLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="text-center p-8 text-gray-500"
                          >
                            {searchTerm
                              ? "No matching risk logs found"
                              : "No risk logs available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authorization Logs Tab */}
          <TabsContent value="authorization-logs" className="mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Authorization Logs
                  </div>
                  <div className="text-sm text-gray-400">
                    {searchTerm || searchFilters.length > 0 ? (
                      <>
                        Showing {filteredAuthLogs.length} of {authLogs.length}{" "}
                        results
                      </>
                    ) : (
                      <>{authLogs.length} total</>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-3 text-gray-400">Doc ID</th>
                        <th className="text-left p-3 text-gray-400">Time</th>
                        <th className="text-left p-3 text-gray-400">User</th>
                        <th className="text-left p-3 text-gray-400">
                          Merchant
                        </th>
                        <th className="text-left p-3 text-gray-400">Type</th>
                        <th className="text-left p-3 text-gray-400">Amount</th>
                        <th className="text-left p-3 text-gray-400">
                          Function
                        </th>
                        <th className="text-left p-3 text-gray-400">
                          Fraud Decision
                        </th>
                        <th className="text-left p-3 text-gray-400">
                          Confidence
                        </th>
                        <th className="text-left p-3 text-gray-400">Nonce</th>
                        <th className="text-left p-3 text-gray-400">Tx Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuthLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.id}
                                color="text-gray-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.userAddress}
                                color="text-blue-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.merchantAddress}
                                color="text-green-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {log.merchantType}
                            </Badge>
                          </td>
                          <td className="p-3 text-yellow-400">
                            {formatAmount(log.amount)} ETH
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{log.functionName}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getRiskIcon(log.fraudDecision)}
                              <Badge
                                variant={getRiskBadgeVariant(log.fraudDecision)}
                              >
                                {log.fraudDecision}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-purple-400">
                            {log.fraudConfidence}%
                          </td>
                          <td className="p-3 text-purple-400">{log.nonce}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.txHash}
                                color="text-orange-400"
                              />
                              <a
                                href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAuthLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={11}
                            className="text-center p-8 text-gray-500"
                          >
                            {searchTerm
                              ? "No matching authorization logs found"
                              : "No authorization logs available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Captured Logs Tab */}
          <TabsContent value="captured-logs" className="mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Captured Funds
                  </div>
                  <div className="text-sm text-gray-400">
                    {searchTerm || searchFilters.length > 0 ? (
                      <>
                        Showing {filteredCapturedLogs.length} of{" "}
                        {capturedLogs.length} results
                      </>
                    ) : (
                      <>{capturedLogs.length} total</>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-3 text-gray-400">Doc ID</th>
                        <th className="text-left p-3 text-gray-400">Time</th>
                        <th className="text-left p-3 text-gray-400">User</th>
                        <th className="text-left p-3 text-gray-400">
                          Merchant
                        </th>
                        <th className="text-left p-3 text-gray-400">Amount</th>
                        <th className="text-left p-3 text-gray-400">Block</th>
                        <th className="text-left p-3 text-gray-400">Tx Hash</th>
                        <th className="text-left p-3 text-gray-400">
                          Log Index
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCapturedLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.id}
                                color="text-gray-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.userAddress}
                                color="text-blue-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.merchantAddress}
                                color="text-green-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-yellow-400">
                            {formatAmount(log.amount)} ETH
                          </td>
                          <td className="p-3 text-purple-400">
                            {log.blockNumber}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.transactionHash}
                                color="text-orange-400"
                              />
                              <a
                                href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">{log.logIndex}</td>
                        </tr>
                      ))}
                      {filteredCapturedLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center p-8 text-gray-500"
                          >
                            {searchTerm
                              ? "No matching captured logs found"
                              : "No captured funds logs available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Released Logs Tab */}
          <TabsContent value="released-logs" className="mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-green-400" />
                    Released Funds
                  </div>
                  <div className="text-sm text-gray-400">
                    {searchTerm || searchFilters.length > 0 ? (
                      <>
                        Showing {filteredReleasedLogs.length} of{" "}
                        {releasedLogs.length} results
                      </>
                    ) : (
                      <>{releasedLogs.length} total</>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-3 text-gray-400">Doc ID</th>
                        <th className="text-left p-3 text-gray-400">Time</th>
                        <th className="text-left p-3 text-gray-400">User</th>
                        <th className="text-left p-3 text-gray-400">
                          Merchant
                        </th>
                        <th className="text-left p-3 text-gray-400">Amount</th>
                        <th className="text-left p-3 text-gray-400">Block</th>
                        <th className="text-left p-3 text-gray-400">Tx Hash</th>
                        <th className="text-left p-3 text-gray-400">
                          Log Index
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReleasedLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.id}
                                color="text-gray-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.userAddress}
                                color="text-blue-400"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.merchantAddress}
                                color="text-green-400"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-yellow-400">
                            {formatAmount(log.amount)} ETH
                          </td>
                          <td className="p-3 text-purple-400">
                            {log.blockNumber}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <WithCopyToClipBoard
                                text={log.transactionHash}
                                color="text-orange-400"
                              />
                              <a
                                href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">{log.logIndex}</td>
                        </tr>
                      ))}
                      {filteredReleasedLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center p-8 text-gray-500"
                          >
                            {searchTerm
                              ? "No matching released logs found"
                              : "No released funds logs available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
