import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Wallet className="w-5 h-5" />
      </div>
      <h1 className="text-lg font-bold text-foreground">StackAI Wallet</h1>
    </div>
  );
}
