import {
  connect,
  Contract,
  keyStores,
  Near,
  WalletConnection,
} from "near-api-js";
import { NearConfig } from "near-api-js/lib/near";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getNearConfig, NEAR_ENV } from "../config/near";

interface Context {
  near: Near | undefined;
  walletConnection: WalletConnection | undefined;
  accountId: any;
  contract: Partial<ContractInterface> | undefined;
  nearConfig: any;
}

export const NearContext = createContext<Context | undefined>(undefined);

export default function useNearContext(): Context {
  return useContext(NearContext) ?? ({} as Context);
}

export interface Game {
  p1: string;
  p2: string;
  deposit: string;
  p1Hash?: string;
  p2Hash?: string;
  p1Raw?: string;
  p2Raw?: string;
  winner?: string;
}

interface ChangeMethodOptions {
  callbackUrl?: string;
  meta?: string;
  args: Record<string, string | number>;
  gas?: string;
  amount?: string | null;
}

type ViewMethodOptions = Record<string, string | number>;

export interface ContractInterface extends Contract {
  getGames(opts?: ViewMethodOptions): Game[];
  getAvailableGames(opts?: ViewMethodOptions): Game[];
  getGameByIndex(opts?: ViewMethodOptions): Game;
  createGame(opts?: ChangeMethodOptions): Promise<void>;
  joinGame(opts?: ChangeMethodOptions): Promise<void>;
  play(opts?: ChangeMethodOptions): Promise<void>;
  reveal(opts?: ChangeMethodOptions): Promise<void>;
}

export function NearProvider({ children }: PropsWithChildren<unknown>) {
  const [near, setNear] = useState<Near>();
  const [nearConfig, setNearConfig] = useState<NearConfig>();
  const [walletConnection, setWalletConnection] = useState<WalletConnection>();
  const [accountId, setAccountId] = useState();
  const [contract, setContract] = useState<Partial<ContractInterface>>();

  const viewMethods = ["getGames", "getGameByIndex", "getAvailableGames"];
  const changeMethods = ["createGame", "joinGame", "play", "reveal"];

  useEffect(() => {
    async function main() {
      const nearConfig = {
        ...getNearConfig(NEAR_ENV.DEVELOPMENT),
        deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
        headers: {},
      };
      const near = await connect(nearConfig);

      const walletConnection = new WalletConnection(near, "rps");

      const contract = await new Contract(
        walletConnection.account(),
        nearConfig.contractName,
        {
          viewMethods,
          changeMethods,
        }
      );

      setNear(near);
      setNearConfig(nearConfig);
      setWalletConnection(walletConnection);
      setAccountId(walletConnection.getAccountId());
      setContract(contract);
    }

    main();
  }, []);

  const value = {
    near,
    walletConnection,
    accountId,
    contract,
    nearConfig,
  };

  return <NearContext.Provider value={value}>{children}</NearContext.Provider>;
}
