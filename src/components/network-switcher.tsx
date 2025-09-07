'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { networks, Network } from '@/components/wallet-provider';
import { cn } from '@/lib/utils';

export function NetworkSwitcher() {
  const { network, setNetwork } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Network>(network);

  const handleSelect = (net: Network) => {
    setSelected(net);
  };
  
  const handleSaveChanges = () => {
      setNetwork(selected);
      setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-[180px] justify-between">
          {network ? network.name : 'Select network...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Network</DialogTitle>
          <DialogDescription>
            Select a new network to connect to. This will require you to log in again.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {networks.map((net) => (
            <button
              key={net.id}
              onClick={() => handleSelect(net)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-md text-left text-sm hover:bg-muted',
                selected.id === net.id && 'bg-muted'
              )}
            >
                <div>
                    <p className="font-semibold">{net.name}</p>
                    <p className="text-xs text-muted-foreground">{net.url}</p>
                </div>
              <Check className={cn('h-4 w-4', selected.id === net.id ? 'opacity-100' : 'opacity-0')} />
            </button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} disabled={network.id === selected.id}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
