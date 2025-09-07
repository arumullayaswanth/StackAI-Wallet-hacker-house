
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot } from 'lucide-react';
import Image from 'next/image';

export function DefiInvestmentAgent() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          <CardTitle>DeFi Investment Agent</CardTitle>
        </div>
        <CardDescription>
          Integrates with Stacks DeFi protocols like ALEX to put your assets to
          work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Image
            src="/alex-logo.svg"
            alt="ALEX Logo"
            width={40}
            height={40}
          />
          <Label className="text-lg font-semibold">ALEX Protocol</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="defi-action">Action</Label>
          <Select>
            <SelectTrigger id="defi-action">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stake">Stake Tokens</SelectItem>
              <SelectItem value="provide-liquidity">
                Provide Liquidity
              </SelectItem>
              <SelectItem value="withdraw">Withdraw</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defi-asset">Asset</Label>
          <Select>
            <SelectTrigger id="defi-asset">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stx">STX</SelectItem>
              <SelectItem value="btc">BTC</SelectItem>
              <SelectItem value="alex">ALEX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defi-amount">Amount</Label>
          <Input id="defi-amount" type="number" placeholder="e.g. 1000" />
        </div>

        <Button className="w-full">
          Execute DeFi Action
        </Button>
      </CardContent>
    </Card>
  );
}
