'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet } from "@stacks/network";

interface WalletContextType {
  userSession: UserSession;
  userData: any | null;
  stxAddress: string | null;
  btcAddress: string | null;
  stxBalance: number;
  btcBalance: number;
  handleConnect: () => void;
  handleDisconnect: () => void;
}

export const WalletContext = createContext<WalletContextType | null>(null);

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const STACKS_API_URL = 'https://api.mainnet.hiro.so';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);

  const fetchBtcBalance = useCallback(async (address: string) => {
    try {
        // Using a public API for BTC balance - in a real app, you might use a more reliable service.
        const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
        const data = await response.json();
        setBtcBalance(data / 100000000); // Convert satoshis to BTC
    } catch (error) {
        console.error('Failed to fetch BTC balance:', error);
        setBtcBalance(0);
    }
  }, []);

  const fetchStxBalance = useCallback(async (address: string) => {
    try {
        const response = await fetch(`${STACKS_API_URL}/extended/v1/address/${address}/balances`);
        const data = await response.json();
        setStxBalance(data.stx.balance / 1000000); // Convert micro-STX to STX
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
      const stxAddr = profile.stxAddress.mainnet;
      const btcAddr = profile.btcAddress.p2wpkh.mainnet;
      setStxAddress(stxAddr);
      setBtcAddress(btcAddr);
      fetchStxBalance(stxAddr);
      fetchBtcBalance(btcAddr);
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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
