'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Wallet as WalletIcon } from 'lucide-react';

export function ConnectWallet() {
  const { stxAddress, handleConnect, handleDisconnect } = useWallet();

  if (stxAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="rounded-full pl-2 pr-3">
             <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=${stxAddress}`} alt="User Avatar" />
                <AvatarFallback>{stxAddress.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[100px] font-mono text-xs">
                {stxAddress}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleConnect}>
      <WalletIcon className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
