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
  checkLP,
  getAirdropInfo,
  getAirdrops,
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
    setLaunchpadsLoading(true);
    let receipt = await getAirdrops();
    if (receipt) {
      store.set("airdrops", receipt);
      setAirdrops(receipt);
    }
    setLaunchpadsLoading(false);
  };

  useEffect(() => {
    let user = window.localStorage.getItem("userAddress");
    let storedLaunchpads = store.get("launchpads");

    getAirdropInfo("0");
    if (storedLaunchpads) {
      setTokens(storedLaunchpads);
    }

    if (user) {
      connectMetamask();
    }
  }, []);

  useEffect(() => {
    let userLaunchs = store.get("userLaunchpads");
    if (userLaunchs) {
      setUserTokens(userLaunchs);
    }
    getUserInfo();
  }, [userAddress]);

  useEffect(() => {
    getContributions();
  }, [tokens]);

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
          <Route path="/" element={<Home />} />
          <Route
            path="/create_launchpad"
            element={
              <CreateLaunchpad
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
                getLaunchpads={getLaunchpads}
                userAddress={userAddress}
                setPopupShow={setPopupShow}
              />
            }
          />
          <Route path="/create_fairlaunch" element={<CreateFairLaunch />} />
          <Route path="/create_token" element={<CreateToken />} />
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
            path="/launchpad_list/:id"
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
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/tokens/:id" element={<ItemDetails />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/liquidity/:id" element={<ItemDetails />} />
          <Route
            path="/create_airdrop"
            element={
              <CreateAirdrop
                userAddress={userAddress}
                setPopupShow={setPopupShow}
              />
            }
          />
          <Route
            path="/airdrop_list"
            element={
              <AirdropList
                launchpadsLoading={launchpadsLoading}
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
