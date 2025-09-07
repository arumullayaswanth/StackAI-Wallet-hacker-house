
import {
  Bot,
  ShieldCheck,
  Bell,
  CandlestickChart,
  Combine,
  MessageCircle,
} from 'lucide-react';
import { StockMarketAgent } from '@/components/agents/stock-market-agent';
import { DefiInvestmentAgent } from '@/components/agents/defi-investment-agent';
import { SecurityAgent } from '@/components/agents/security-agent';
import { NotificationAgent } from '@/components/agents/notification-agent';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-8">
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-3xl font-bold tracking-tight sm:grow-0">
              AI Agent Command Center
            </h1>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
             <Card className="xl:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  <CardTitle>Natural Language Agent</CardTitle>
                </div>
                <CardDescription>
                  The core of your wallet. Parses your commands to execute
                  transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This agent is active on the main dashboard. Use the chat
                  interface to give commands like "send 10 STX to..." or "what's
                  the top rising stock?".
                </p>
                 <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Go to Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <StockMarketAgent />
            <DefiInvestmentAgent />
            <SecurityAgent />
            <NotificationAgent />
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Combine className="w-8 h-8 text-primary" />
                  <CardTitle>Extensible Agent System</CardTitle>
                </div>
                <CardDescription>
                  The underlying framework is designed for new capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  More agents for NFTs, DAO voting, and other Web3 interactions can
                  be added in the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
