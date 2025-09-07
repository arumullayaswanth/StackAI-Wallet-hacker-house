'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppConfig, UserSession, showConnect, openSTXTransfer } from '@stacks/connect';
import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';
import { ActionResponse } from '@/app/actions';

export type Network = {
  id: string;
  name: string;
  url: string;
  instance: StacksMainnet | StacksTestnet | StacksDevnet;
};

export const networks: Network[] = [
  { id: 'mainnet', name: 'Mainnet', url: 'https://api.hiro.so', instance: new StacksMainnet() },
  { id: 'testnet', name: 'Testnet', url: 'https://api.testnet.hiro.so', instance: new StacksTestnet() },
  { id: 'devnet', name: 'Devnet', url: 'http://localhost:3999', instance: new StacksDevnet() },
];

interface WalletContextType {
  userSession: UserSession;
  userData: any | null;
  stxAddress: string | null;
  btcAddress: string | null;
  stxBalance: number;
  btcBalance: number;
  network: Network;
  setNetwork: (network: Network) => void;
  handleConnect: () => void;
  handleDisconnect: () => void;
  handleSendTransaction: (transaction: ActionResponse['transaction']) => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | null>(null);

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [network, setNetworkState] = useState<Network>(networks[1]); // Default to Testnet

  const setNetwork = (newNetwork: Network) => {
    setNetworkState(newNetwork);
    localStorage.setItem('selectedNetwork', newNetwork.id);
    // Disconnect and force re-login on the new network
    if (userSession.isUserSignedIn()) {
      handleDisconnect();
    }
  };
  
  useEffect(() => {
    const savedNetworkId = localStorage.getItem('selectedNetwork');
    const savedNetwork = networks.find(n => n.id === savedNetworkId) || networks[1];
    setNetworkState(savedNetwork);
  }, []);
  
  const fetchBtcBalance = useCallback(async (address: string, net: Network) => {
    if (net.id !== 'mainnet' && net.id !== 'testnet') {
        setBtcBalance(0);
        return;
    }
    const apiNetwork = net.id === 'mainnet' ? 'main' : 'test3';
    try {
        const response = await fetch(`https://api.blockcypher.com/v1/btc/${apiNetwork}/addrs/${address}/balance`);
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

  const fetchStxBalance = useCallback(async (address: string, net: Network) => {
    try {
        const response = await fetch(`${net.url}/extended/v1/address/${address}/balances`);
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
        const stxAddr = network.id === 'mainnet' ? profile.stxAddress.mainnet : profile.stxAddress.testnet;
        const btcAddr = network.id === 'mainnet' ? profile.btcAddress.p2wpkh.mainnet : profile.btcAddress.p2wpkh.testnet;
        setStxAddress(stxAddr);
        setBtcAddress(btcAddr);
        if(stxAddr) fetchStxBalance(stxAddr, network);
        if(btcAddr) fetchBtcBalance(btcAddr, network);
      }
    }
  }, [fetchStxBalance, fetchBtcBalance, network]);

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'StackAI Wallet',
        icon: window.location.origin + '/logo.png',
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
       return new Promise<void>((resolve, reject) => {
           openSTXTransfer({
                network: network.instance,
                recipient: transaction.recipient,
                amount: transaction.amount * 1000000, // Convert STX to micro-STX
                memo: 'Sent from StackAI Wallet',
                onFinish: (data) => {
                    console.log('STX Transfer finished:', data);
                    if(stxAddress) fetchStxBalance(stxAddress, network);
                    resolve();
                },
                onCancel: () => {
                    console.log('STX Transfer canceled.');
                    reject(new Error("Transaction was canceled by the user."));
                }
            });
       });
    } else {
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
        network,
        setNetwork,
        handleConnect,
        handleDisconnect,
        handleSendTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
