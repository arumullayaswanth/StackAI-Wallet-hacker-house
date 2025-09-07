import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, Blocks, DollarSign, TrendingUp } from 'lucide-react';

const btcBalance = 0.5;
const stxBalance = 1200;
const btcPrice = 67000;
const stxPrice = 2.1;

export function WalletOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bitcoin Balance
          </CardTitle>
          <Bitcoin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{btcBalance.toFixed(4)} BTC</div>
          <p className="text-xs text-muted-foreground">
            ≈ ${(btcBalance * btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Stacks Balance
          </CardTitle>
          <Blocks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stxBalance.toLocaleString()} STX</div>
          <p className="text-xs text-muted-foreground">
            ≈ ${(stxBalance * stxPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
           <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${((btcBalance * btcPrice) + (stxBalance * stxPrice)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">+5.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Simulated P/L
          </CardTitle>
           <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+$2,150.78</div>
          <p className="text-xs text-muted-foreground">
            All time
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
