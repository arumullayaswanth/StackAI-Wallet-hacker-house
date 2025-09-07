
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
import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function SecurityAgent() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <CardTitle>Security Agent</CardTitle>
        </div>
        <CardDescription>
          Runs safety checks before executing AI decisions to protect your
          assets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-base font-semibold">
            Single Transaction Limit
          </Label>
          <p className="text-sm text-muted-foreground">
            Prevent any single AI-driven transaction from exceeding a certain
            percentage of your total balance without manual confirmation.
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Slider defaultValue={[20]} max={100} step={1} />
            <span className="w-16 text-center font-mono p-2 bg-muted rounded-md">
              20%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="text-base font-semibold">
              Confirmation Requirement
            </Label>
            <p className="text-sm text-muted-foreground">
              Require manual confirmation for all AI-initiated transactions.
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-base font-semibold">Address Whitelist</Label>
          <p className="text-sm text-muted-foreground">
            Only allow AI agents to send funds to addresses on this list.
            (Coming Soon)
          </p>
          <Button disabled variant="secondary">
            Manage Whitelist
          </Button>
        </div>

        <Button className="w-full">
          Save Security Settings
        </Button>
      </CardContent>
    </Card>
  );
}
