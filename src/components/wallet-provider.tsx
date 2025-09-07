'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppConfig, UserSession, showConnect, openSTXTokenTransfer } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { ActionResponse } from '@/app/actions';

interface WalletContextType {
  userSession: UserSession;
  userData: any | null;
  stxAddress: string | null;
  btcAddress: string | null;
  stxBalance: number;
  btcBalance: number;
  handleConnect: () => void;
  handleDisconnect: () => void;
  handleSendTransaction: (transaction: ActionResponse['transaction']) => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | null>(null);

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const STACKS_API_URL = 'https://api.testnet.hiro.so';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);

  const fetchBtcBalance = useCallback(async (address: string) => {
    try {
        // Using blockcypher's API for testnet balance
        const response = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`);
        if(response.ok) {
            const data = await response.json();
            setBtcBalance(data.final_balance / 100000000); // Convert satoshis to BTC
        } else {
             console.error('Failed to fetch BTC balance with status:', response.status);
             setBtcBalance(0);
        }
    } catch (error) {
        console.error('Failed to fetch BTC balance:', error);
        setBtcBalance(0);
    }
  }, []);

  const fetchStxBalance = useCallback(async (address: string) => {
    try {
        const response = await fetch(`${STACKS_API_URL}/extended/v1/address/${address}/balances`);
        if (response.ok) {
          const data = await response.json();
          setStxBalance(data.stx.balance / 1000000); // Convert micro-STX to STX
        } else {
          console.error('Failed to fetch STX balance with status:', response.status);
          setStxBalance(0);
        }
    } catch (error) {
        console.error('Failed to fetch STX balance:', error);
        setStxBalance(0);
    }
  }, []);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const sessionData = userSession.loadUserData();
      setUserData(sessionData);
      const profile = sessionData.profile;
      if (profile) {
        const stxAddr = profile.stxAddress.testnet;
        const btcAddr = profile.btcAddress.p2wpkh.testnet;
        setStxAddress(stxAddr);
        setBtcAddress(btcAddr);
        if(stxAddr) fetchStxBalance(stxAddr);
        if(btcAddr) fetchBtcBalance(btcAddr);
      }
    }
  }, [fetchStxBalance, fetchBtcBalance]);

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'StackAI Wallet',
        icon: window.location.origin + '/logo.png', // Ensure you have a logo at this path
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut('/');
    setUserData(null);
    setStxAddress(null);
    setBtcAddress(null);
    setStxBalance(0);
    setBtcBalance(0);
  };
  
  const handleSendTransaction = async (transaction: ActionResponse['transaction']) => {
    if (!transaction || !stxAddress) {
        throw new Error("Transaction details are missing or user is not connected.");
    }
    
    if (transaction.asset === 'STX') {
       const network = new StacksTestnet();
       return new Promise<void>((resolve, reject) => {
           openSTXTokenTransfer({
                network: network,
                recipient: transaction.recipient,
                amount: transaction.amount * 1000000, // Convert STX to micro-STX
                memo: 'Sent from StackAI Wallet',
                onFinish: (data) => {
                    console.log('STX Transfer finished:', data);
                    // After a successful transaction, you might want to refetch the balance.
                    if(stxAddress) fetchStxBalance(stxAddress);
                    resolve();
                },
                onCancel: () => {
                    console.log('STX Transfer canceled.');
                    reject(new Error("Transaction was canceled by the user."));
                }
            });
       });
    } else {
        // TODO: Implement BTC and USDT transfers
        console.warn(`${transaction.asset} transfers not yet implemented.`);
        throw new Error(`${transaction.asset} transfers are not yet supported.`);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        userSession,
        userData,
        stxAddress,
        btcAddress,
        stxBalance,
        btcBalance,
        handleConnect,
        handleDisconnect,
        handleSendTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
