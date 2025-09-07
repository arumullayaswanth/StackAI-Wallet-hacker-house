
import { DailyStockReport } from '@/components/daily-stock-report';

export default function MarketPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
         <DailyStockReport />
      </div>
    </div>
  );
}
