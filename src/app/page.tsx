import { DashboardLayout } from '@/components/dashboard-layout';
import { WalletOverview } from '@/components/wallet-overview';
import { ChatInterface } from '@/components/chat-interface';
import { TransactionHistory } from '@/components/transaction-history';
import { MyAssets } from '@/components/my-assets';

export default function Home() {
  return (
      <div className="flex flex-col gap-8">
        <WalletOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
          <div className="flex flex-col gap-8">
            <MyAssets />
            <TransactionHistory />
          </div>
        </div>
      </div>
  );
}
