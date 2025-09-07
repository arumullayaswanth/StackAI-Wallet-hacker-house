
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function TransactionHistory({ showAll = false }: { showAll?: boolean }) {
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
      
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const date = parseISO(tx.burn_block_time_iso);
    let group;
    if (isToday(date)) {
        group = 'Today';
    } else if (isYesterday(date)) {
        group = 'Yesterday';
    } else {
        group = format(date, 'MMMM d, yyyy');
    }

    if (!acc[group]) {
        acc[group] = [];
    }
    acc[group].push(tx);
    return acc;
  }, {} as Record<string, any[]>);

  const renderContent = () => {
    if (!stxAddress) {
      return (
        <div className="text-center text-muted-foreground py-8">
          Please connect your wallet to view your activity.
        </div>
      );
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
      );
    }
    
    const transactionsToShowInGroups = showAll ? groupedTransactions : Object.fromEntries(Object.entries(groupedTransactions).slice(0, 1));
    const txsToDisplay = showAll ? transactions : transactions.slice(0, 5);

    if (transactions.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No recent transactions found.
        </div>
      );
    }

    const finalTransactions = showAll ? groupedTransactions : {'Recent Activity' : txsToDisplay};


    return (
        <div className="space-y-6">
            {Object.entries(finalTransactions).map(([group, txs]) => (
                <div key={group}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
                        {group}
                    </h3>
                    <div className="space-y-1">
                        {txs.map((tx: any) => {
                             const isSent = tx.sender_address === stxAddress;
                             const transfer = tx.stx_transfers[0];
                             const details = isSent ? `to ${transfer.recipient}` : `from ${tx.sender_address}`;
                             const formattedDetails = `${details.slice(0,10)}...${details.slice(-4)}`;

                            return (
                                <div key={tx.tx_id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                                     <div className="flex items-center gap-3">
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
                                            <div className="text-sm text-muted-foreground" title={details}>
                                            {formattedDetails}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium font-mono">{formatStxAmount(Number(transfer.amount))} STX</div>
                                        <div className="text-xs">
                                        {getStatusBadge(tx.tx_status)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{showAll ? 'Transaction History' : 'Recent Activity'}</CardTitle>
          <CardDescription>
            {showAll ? 'A complete log of your transactions.' : 'A log of your recent transactions.'}
          </CardDescription>
        </div>
        {stxAddress && transactions.length > 5 && !showAll && (
          <Link href="/history">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
         {renderContent()}
      </CardContent>
    </Card>
  );
}
