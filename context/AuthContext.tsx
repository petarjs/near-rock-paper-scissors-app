import { createContext, PropsWithChildren, useContext, useState } from "react";
import useNearContext from "./NearContext";

interface Context {
  signIn(): void;
  signOut(): void;
  isSignedIn(): boolean;
}

export const AuthContext = createContext<Context | undefined>(undefined);

export default function useAuthContext(): Context {
  return useContext(AuthContext) ?? ({} as Context);
}

export function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const { nearConfig, walletConnection, reset } = useNearContext();

  function signIn() {
    walletConnection?.requestSignIn(nearConfig.contractName);
  }

  function signOut() {
    walletConnection?.signOut();
    reset();
  }

  function isSignedIn() {
    return !!walletConnection?.isSignedIn();
  }

  const value = {
    signIn,
    signOut,
    isSignedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
