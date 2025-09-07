'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWallet } from '@/hooks/use-wallet';

// Mock prices, in a real app you would fetch these from an API
const btcPrice = 67000;
const stxPrice = 2.1;

export function MyAssets() {
  const { stxBalance, btcBalance, stxAddress } = useWallet();

  const assets = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      balance: btcBalance,
      value: btcBalance * btcPrice,
      logo: '/btc-logo.svg',
    },
    {
      name: 'Stacks',
      ticker: 'STX',
      balance: stxBalance,
      value: stxBalance * stxPrice,
      logo: '/stx-logo.svg',
    },
  ];

  if (!stxAddress) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Assets</CardTitle>
                <CardDescription>Connect your wallet to see your assets.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">
                    Please connect your wallet.
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assets</CardTitle>
        <CardDescription>An overview of your crypto holdings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.ticker}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={asset.logo} alt={asset.name} />
                       <AvatarFallback>{asset.ticker.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.ticker}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {asset.balance.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
