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
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const transactions = [
  {
    type: 'Transfer',
    direction: 'out',
    details: 'to SP3...K8',
    amount: '0.02 BTC',
    status: 'Completed',
    date: '2024-07-28',
  },
  {
    type: 'Simulated Trade',
    direction: 'in',
    details: 'Buy AAPL',
    amount: '150 STX',
    status: 'Completed',
    date: '2024-07-27',
  },
  {
    type: 'Deposit',
    direction: 'in',
    details: 'from 1Bv...sE',
    amount: '0.1 BTC',
    status: 'Completed',
    date: '2024-07-25',
  },
  {
    type: 'AI Swap',
    direction: 'out',
    details: 'STX to BTC',
    amount: '500 STX',
    status: 'Failed',
    date: '2024-07-24',
  },
   {
    type: 'Staked',
    direction: 'in',
    details: 'in ALEX pool',
    amount: '1,000 STX',
    status: 'Processing',
    date: '2024-07-22',
  },
];

export function TransactionHistory() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="secondary" className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'>Completed</Badge>;
      case 'Processing':
        return <Badge variant="secondary" className='bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'>Processing</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A log of your recent transactions and agent actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${tx.direction === 'in' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                      {tx.direction === 'in' ? <ArrowDownLeft className="h-4 w-4 text-green-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
                    </div>
                    <div>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {tx.details}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">{tx.amount}</div>
                  <div className="text-sm text-muted-foreground">{getStatusBadge(tx.status)}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
