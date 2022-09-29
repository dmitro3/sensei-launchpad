import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ConnectPopup from "./components/ConnectPopup";
import CreateFairLaunch from "./components/pages/CreateFairLaunch";
import CreateLaunchpad from "./components/pages/CreateLaunchpad";
import Home from "./components/pages/Home";
import Sidebar from "./components/Sidebar";
import CreateToken from "./components/pages/CreateToken";
import LaunchpadList from "./components/pages/LaunchpadList/LaunchpadList";
import TokenDetails from "./components/pages/LaunchpadList/TokenDetails";
import CreateLock from "./components/pages/CreateLock";
import Tokens from "./components/pages/Tokens";
import ItemDetails from "./components/common/ItemDetails";
import RecordDetails from "./components/common/recordDetails";
import Liquidity from "./components/pages/Liquidity";
import CreateAirdrop from "./components/pages/CreateAirdrop";
import AirdropList from "./components/pages/AirdropList/AirdropList";
import AirdropDetails from "./components/pages/AirdropList/AirdropDetails";
import NetworkPopup from "./components/NetworkPopup";
import CreateLaunchpad2 from "./components/pages/CreateLaunchpad2";
import Header from "./components/Header";
import useSmallScreen from "./hooks/useSmallScreen";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import {
  launchpadDetails,
  nativeBalance,
  getUserContributions,
  getNormalTokensLock,
  getUserAirdrops,
  getAirdrops,
  getLPTokensLock,
  getUserLocks,
  getDeployerStats,
} from "./blockchain/functions";
import store from "store2";

function App() {
  const [popupShow, setPopupShow] = useState(false);
  const [networkPopupShow, setNetworkPopupShow] = useState(false);
  const smallScreen = useSmallScreen(990);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [airdrops, setAirdrops] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [walletProvider, setWalletProvider] = useState();
  const [userBalance, setUserBalance] = useState("");
  const [launchpadsLoading, setLaunchpadsLoading] = useState(false);
  const [airdropsLoading, setAirdropsLoading] = useState(false);
  const [lockersLoading, setLockersLoading] = useState(false);
  const [userAirdrops, setUserAirdrops] = useState();
  const [regularLocker, setRegularLockers] = useState([]);
  const [liquidityLocker, setLiquidityLockers] = useState([]);
  const [userLocks, setUserLocks] = useState({
    normalLocks: [],
    lpLocks: [],
  });
  const [stats, setStats] = useState({
    projects: "",
    invested: "",
    participants: "",
  });

  const connectMetamask = async () => {
    console.log("hola");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);
      setPopupShow(false);

      window.localStorage.setItem("userAddress", accounts[0]);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== "0x61") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }],
        });
      }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletConnect = async () => {
    try {
      console.log("hola");
      const provider = new WalletConnectProvider({
        rpc: {
          // 56: "https://bsc-dataseed.binance.org/",
          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
        // network: "binance",
        chainId: 97,
        infuraId: null,
      });

      await provider.enable();
      setWalletProvider(provider);
      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();

      setUserAddress(accounts[0]);
      setPopupShow(false);
      setWalletType("WALLET_CONNECT");
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (walletType === "WALLET_CONNECT") {
      const provider = new WalletConnectProvider({
        rpc: {
          // 56: "https://bsc-dataseed1.ninicoin.io/",

          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
        chainId: 97,
        infuraId: null,
      });
      await provider.disconnect();
    }

    store.remove("userLaunchpads");

    setUserAddress("");
  };

  const getUserInfo = async () => {
    if (userAddress) {
      console.log(userAddress, "user");
      let balance = await nativeBalance(userAddress);
      if (balance) {
        setUserBalance(balance);
      }
    }
  };

  const getContributions = async () => {
    if (userAddress) {
      let contributions = await getUserContributions(userAddress);
      if (contributions) {
        let temp = [];
        contributions[0].map((el, index) => {
          let item = tokens.find((i) => i.id === Number(el));
          console.log(item, "item");
          if (item) {
            let indexInToken = tokens.findIndex((i) => i.id === Number(el));
            tokens[indexInToken].userContribution = contributions[1][index];
            item.userContribution = contributions[1][index];
            temp.push(item);
          }
        });
        console.log(temp, "temp");
        store.set("userLaunchpads", temp);
        store.set("launchpads", tokens);
        setUserTokens(temp);
      }

      console.log("contributions", contributions);
    }
  };

  const fetchUserAirdrops = async () => {
    if (userAddress) {
      let contributions = await getUserAirdrops(userAddress);
      if (contributions) {
        let temp = [];
        contributions[0].map((el, index) => {
          let item = airdrops.find((i) => i.id === Number(el));
          console.log(item, "item");
          if (item) {
            let indexInToken = airdrops.findIndex((i) => i.id === Number(el));
            airdrops[indexInToken].userContribution = contributions[1][index];
            item.userContribution = contributions[1][index];
            temp.push(item);
          }
        });
        console.log(temp, "temp airdrops");
        store.set("userAirdrops", temp);
        store.set("airdrops", airdrops);
        setUserAirdrops(temp);
      }

      console.log("contributions", contributions);
    }
  };

  const getLaunchpads = async () => {
    setLaunchpadsLoading(true);
    let receipt = await launchpadDetails();
    if (receipt) {
      store.set("launchpads", receipt);
      setTokens(receipt);
    }
    setLaunchpadsLoading(false);
  };

  const getAirdropsDetails = async () => {
    setAirdropsLoading(true);
    let receipt = await getAirdrops();
    if (receipt) {
      store.set("airdrops", receipt);
      setAirdrops(receipt);
    }
    setAirdropsLoading(false);
  };

  const getRegularLockers = async () => {
    setLockersLoading(true);
    let receipt = await getNormalTokensLock();
    if (receipt) {
      console.log(receipt, "regular tokens");
      store.set("regularLockers", receipt);
      setRegularLockers(receipt);
    }
    setLockersLoading(false);
    return receipt;
  };

  const getLiquidityLockers = async () => {
    setLockersLoading(true);
    let receipt = await getLPTokensLock();
    if (receipt) {
      console.log(receipt, "lp tokens");
      store.set("liquidityLockers", receipt);
      setLiquidityLockers(receipt);
    }
    setLockersLoading(false);
    return receipt;
  };

  const fetchUserLocks = async () => {
    if (userAddress) {
      let receipt = await getUserLocks(userAddress);
      if (receipt) {
        let normalLocks = [];
        let lpLocks = [];

        receipt.normalLocks.map((el, index) => {
          let temp = { ...el };
          let data = regularLocker.find((i) => i[0] === el.token);
          let parentIndex = regularLocker.findIndex((i) => i[0] === el.token);
          temp = { ...temp, ...data, parentIndex };
          normalLocks.push(temp);
          return temp;
        });

        receipt.LpLocks.map((el, index) => {
          let temp = { ...el };
          let data = liquidityLocker.find((i) => i[0] === el.token);
          let parentIndex = liquidityLocker.findIndex((i) => i[0] === el.token);
          temp = { ...temp, ...data, parentIndex };
          lpLocks.push(temp);
          return temp;
        });

        store.set("userLockers", { normalLocks, lpLocks });
        setUserLocks({ normalLocks, lpLocks });
      }
    }
  };

  const getStats = async () => {
    let newStats = await getDeployerStats();
    setStats({ ...newStats });
  };

  useEffect(() => {
    let user = window.localStorage.getItem("userAddress");
    let storedLaunchpads = store.get("launchpads");
    let storedAirdrops = store.get("airdrops");
    let storedLockers = store.get("regularLockers");
    let storedLPLockers = store.get("liquidityLockers");

    if (storedLaunchpads) {
      setTokens(storedLaunchpads);
    }
    if (storedAirdrops) {
      setAirdrops(storedAirdrops);
    }
    if (storedLockers) {
      setRegularLockers(storedLockers);
    }
    if (storedLPLockers) {
      setLiquidityLockers(storedLPLockers);
    }

    if (user) {
      connectMetamask();
    }

    getStats();
  }, []);

  useEffect(() => {
    let userLaunchs = store.get("userLaunchpads");
    let userAirdrops = store.get("userAirdrops");
    let userLockers = store.get("userLockers");
    if (userLaunchs) {
      setUserTokens(userLaunchs);
    }
    if (userAirdrops) {
      setUserAirdrops(userAirdrops);
    }
    if (userLockers) {
      setUserLocks(userLockers);
    }
    getUserInfo();
  }, [userAddress]);

  useEffect(() => {
    getContributions();
  }, [userAddress, tokens]);

  useEffect(() => {
    fetchUserAirdrops();
  }, [userAddress, airdrops]);

  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [menuVisible]);

  return (
    <>
      {smallScreen && (
        <Header menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
      )}
      <Sidebar
        disconnectWallet={disconnectWallet}
        userAddress={userAddress}
        setPopupShow={setPopupShow}
        setNetworkPopupShow={setNetworkPopupShow}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
      />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <LaunchpadList
                launchpadsLoading={launchpadsLoading}
                userTokens={userTokens}
                getLaunchpads={getLaunchpads}
                tokens={tokens}
              />
            }
          />
          {/* <Route path="/" element={<Home stats={stats} />} /> */}
          <Route
            path="/create_launchpad"
            element={
              <CreateLaunchpad
                walletType={walletType}
                walletProvider={walletProvider}
                getLaunchpads={getLaunchpads}
                userAddress={userAddress}
                setPopupShow={setPopupShow}
              />
            }
          />
          <Route
            path="/create_launchpad/:id"
            element={
              <CreateLaunchpad
                walletType={walletType}
                walletProvider={walletProvider}
                getLaunchpads={getLaunchpads}
                userAddress={userAddress}
                setPopupShow={setPopupShow}
              />
            }
          />
          <Route path="/create_fairlaunch" element={<CreateFairLaunch />} />
          <Route
            path="/create_token"
            element={
              <CreateToken
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route
            path="/launchpad_list"
            element={
              <LaunchpadList
                launchpadsLoading={launchpadsLoading}
                userTokens={userTokens}
                getLaunchpads={getLaunchpads}
                tokens={tokens}
              />
            }
          />
          <Route
            path="/launchpad_list/:id/:address"
            element={
              <TokenDetails
                userAddress={userAddress}
                setPopupShow={setPopupShow}
                tokens={tokens}
                walletType={walletType}
                walletProvider={walletProvider}
                userBalance={userBalance}
                getUserInfo={getUserInfo}
              />
            }
          />
          <Route
            path="/create_lock"
            element={
              <CreateLock
                userAddress={userAddress}
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route
            path="/tokens"
            element={
              <Tokens
                lockersLoading={lockersLoading}
                userLocks={userLocks.normalLocks}
                fetchUserLocks={fetchUserLocks}
                getRegularLockers={getRegularLockers}
                lockers={regularLocker}
              />
            }
          />
          <Route
            path="/tokens/:id"
            element={
              <ItemDetails
                tokens={true}
                getRegularLockers={getRegularLockers}
                lockers={regularLocker}
              />
            }
          />
          <Route
            path="/tokens/:id/:record"
            element={
              <RecordDetails
                userAddress={userAddress}
                getRegularLockers={getRegularLockers}
                lockers={regularLocker}
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route
            path="/liquidity"
            element={
              <Liquidity
                lockersLoading={lockersLoading}
                userLocks={userLocks.lpLocks}
                fetchUserLocks={fetchUserLocks}
                getLiquidityLockers={getLiquidityLockers}
                lockers={liquidityLocker}
              />
            }
          />
          <Route
            path="/liquidity/:id"
            element={
              <ItemDetails
                getRegularLockers={getLiquidityLockers}
                lockers={liquidityLocker}
              />
            }
          />

          <Route
            path="/liquidity/:id/:record"
            element={
              <RecordDetails
                LP={true}
                userAddress={userAddress}
                getRegularLockers={getLiquidityLockers}
                lockers={liquidityLocker}
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route
            path="/create_airdrop"
            element={
              <CreateAirdrop
                userAddress={userAddress}
                setPopupShow={setPopupShow}
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route
            path="/airdrop_list"
            element={
              <AirdropList
                userAddress={userAddress}
                fetchUserAirdrops={fetchUserAirdrops}
                userAirdrops={userAirdrops}
                airdropsLoading={airdropsLoading}
                airdrops={airdrops}
                getAirdropsDetails={getAirdropsDetails}
              />
            }
          />
          <Route
            path="/airdrop_list/:id"
            element={
              <AirdropDetails
                userAddress={userAddress}
                setPopupShow={setPopupShow}
                airdrops={airdrops}
                walletType={walletType}
                walletProvider={walletProvider}
              />
            }
          />
          <Route path="/create_launchpad2" element={<CreateLaunchpad2 />} />
        </Routes>
        <p className="disclaimer container">
          Disclaimer: The information provided shall not in any way constitute a
          recommendation as to whether you should invest in any product
          discussed. We accept no liability for any loss occasioned to any
          person acting or refraining from action as a result of any material
          provided or published.
        </p>
      </main>
      <ConnectPopup
        connectMetamask={connectMetamask}
        connectWalletConnect={connectWalletConnect}
        popupShow={popupShow}
        setPopupShow={setPopupShow}
      />
      <NetworkPopup
        popupShow={networkPopupShow}
        setPopupShow={setNetworkPopupShow}
      />
    </>
  );
}

export default App;
