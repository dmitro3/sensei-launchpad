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
import { launchpadDetails, nativeBalance } from "./blockchain/functions";

function App() {
  const [popupShow, setPopupShow] = useState(false);
  const [networkPopupShow, setNetworkPopupShow] = useState(false);
  const smallScreen = useSmallScreen(990);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [walletProvider, setWalletProvider] = useState();
  const [userBalance, setUserBalance] = useState("");

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
    } else {
    }

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

  useEffect(() => {
    const getLaunchpads = async () => {
      let receipt = await launchpadDetails();
      if (receipt) {
        setTokens(receipt);
      }
    };

    let user = window.localStorage.getItem("userAddress");

    if (user) {
      connectMetamask();
    }

    getLaunchpads();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [userAddress]);

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
                userAddress={userAddress}
                setPopupShow={setPopupShow}
              />
            }
          />
          <Route path="/create_fairlaunch" element={<CreateFairLaunch />} />
          <Route path="/create_token" element={<CreateToken />} />
          <Route
            path="/launchpad_list"
            element={<LaunchpadList tokens={tokens} />}
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
          <Route path="/create_lock" element={<CreateLock />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/tokens/:id" element={<ItemDetails />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/liquidity/:id" element={<ItemDetails />} />
          <Route path="/create_airdrop" element={<CreateAirdrop />} />
          <Route path="/airdrop_list" element={<AirdropList />} />
          <Route path="/airdrop_list/:id" element={<AirdropDetails />} />
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
