
'use client';
import { TransactionHistory } from '@/components/transaction-history';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
         <TransactionHistory />
      </div>
    </div>
  );
}
