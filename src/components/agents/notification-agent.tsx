
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
import { Bell } from 'lucide-react';
import { Switch } from '../ui/switch';

export function NotificationAgent() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          <CardTitle>Notification Agent</CardTitle>
        </div>
        <CardDescription>
          Get alerts for transactions and daily summaries of your wallet's
          performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-base font-semibold">
            Transaction Notifications
          </Label>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Send an alert after every transaction.
            </p>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notify-email" className="text-xs">
                Email Address
              </Label>
              <Input
                id="notify-email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="notify-telegram" className="text-xs">
                Telegram ID
              </Label>
              <Input
                id="notify-telegram"
                type="text"
                placeholder="@your_handle"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-base font-semibold">
            Performance Summaries
          </Label>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Receive wallet performance reports.
            </p>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary-frequency">Frequency</Label>
            <Select disabled>
              <SelectTrigger id="summary-frequency">
                <SelectValue placeholder="Daily" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full">
          Update Notification Settings
        </Button>
      </CardContent>
    </Card>
  );
}
