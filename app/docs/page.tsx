import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MarkdownRenderer from "@/src/components/docs/markdown-renderer";
import SearchBar from "@/src/components/docs/search-bar";
import TableOfContents from "@/src/components/docs/table-of-contents";
import { promises as fs } from "fs";
import path from "path";

async function getMarkdownContent() {
  const contractsPath = path.join(
    process.cwd(),
    "aegiscontracts-repo-readme.md",
  );
  const crePath = path.join(
    process.cwd(),
    "aegis-chainink-cre-workflow-readme.md",
  );

  const [contractsContent, creContent] = await Promise.all([
    fs.readFile(contractsPath, "utf-8"),
    fs.readFile(crePath, "utf-8"),
  ]);

  return {
    contracts: contractsContent,
    cre: creContent,
  };
}

export default async function DocsPage() {
  const { contracts, cre } = await getMarkdownContent();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              AegisPay Documentation
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Complete technical documentation for AegisPay's decentralized
              payment protocol and AI risk engine
            </p>
          </header>

          <div className="mb-8">
            <SearchBar contractsContent={contracts} creContent={cre} />
          </div>

          <Tabs defaultValue="contracts" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-800/50 border border-slate-700">
              <TabsTrigger
                value="contracts"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                Smart Contracts
              </TabsTrigger>
              <TabsTrigger
                value="cre"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                CRE Workflow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contracts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <TableOfContents content={contracts} />
                </div>
                <Card className="lg:col-span-3 order-1 lg:order-2 bg-slate-900/50 border-slate-800 backdrop-blur">
                  <MarkdownRenderer content={contracts} />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cre" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <TableOfContents content={cre} />
                </div>
                <Card className="lg:col-span-3 order-1 lg:order-2 bg-slate-900/50 border-slate-800 backdrop-blur">
                  <MarkdownRenderer content={cre} />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
