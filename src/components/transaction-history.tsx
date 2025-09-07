
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';

export function TransactionHistory() {
  const { transactions, stxAddress, network, isLoadingTransactions } = useWallet();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
          >
            Success
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          >
            Pending
          </Badge>
        );
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatStxAmount = (microStx: number) => {
    return (microStx / 1000000).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const explorerUrl =
    network.id === 'mainnet'
      ? `https://explorer.stacks.co/txid`
      : `https://explorer.stacks.co/txid?chain=${network.id}`;

  const renderContent = () => {
    if (!stxAddress) {
       return (
         <div className="text-center text-muted-foreground py-8">
            Please connect your wallet to view your activity.
         </div>
       )
    }

    if (isLoadingTransactions) {
      return (
         <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                 <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                 </div>
             </div>
          ))}
        </div>
      )
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No recent transactions found.
        </div>
      )
    }

    return (
       <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 10).map((tx) => {
              const isSent = tx.sender_address === stxAddress;
              const transfer = tx.stx_transfers[0];
              const details = isSent ? `to ${transfer.recipient}` : `from ${tx.sender_address}`;
              const formattedDetails = `${details.slice(0,10)}...${details.slice(-4)}`;

              return (
                <TableRow key={tx.tx_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-full ${isSent ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                        {isSent ? <ArrowUpRight className="h-4 w-4 text-red-600" /> : <ArrowDownLeft className="h-4 w-4 text-green-600" />}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          {tx.tx_type === 'token_transfer' ? 'Transfer' : tx.tx_type.replace('_', ' ')}
                           <a href={`${explorerUrl}/${tx.tx_id}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                             <ExternalLink className="h-3 w-3"/>
                           </a>
                        </div>
                        <div className="text-sm text-muted-foreground hidden sm:block" title={details}>
                           {formattedDetails}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium font-mono">{formatStxAmount(Number(transfer.amount))} STX</div>
                    <div className="text-sm text-muted-foreground">
                      {getStatusBadge(tx.tx_status)}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of your recent transactions.
            </CardDescription>
        </div>
         {stxAddress && transactions.length > 0 && (
             <Link href="/history">
                <Button variant="outline" size="sm">View All</Button>
             </Link>
         )}
      </CardHeader>
      <CardContent>
         {renderContent()}
      </CardContent>
    </Card>
  );
}
