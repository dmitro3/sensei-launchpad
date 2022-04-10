import { ethers, providers } from "ethers";
import {
  deployerABI,
  launchpadABI,
  liquidityTokenAbi,
  standardTokenAbi,
  lockerAbi,
  pairAbi,
  airdropDeployerABI,
  airdropABI,
} from "./abis";
import { liquidityTokenByte, standardTokenByte } from "./bytecode";
import axios from "axios";
import senseiLogo from "../img/common/notFound.png";

let tokenAbi = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

let provider = new ethers.providers.JsonRpcProvider(
  // "https://bsc-dataseed1.ninicoin.io/"
  "https://data-seed-prebsc-2-s2.binance.org:8545/"
);

let deployerAddress = "0x039b7F5Be8410c7B962D603d7514dD7C20E2CD8F";
let lockerAddress = "0x9D367D8562957c68c47Baf54E128253921dd0279";
let airdropDeployer = "0x985CD8ec7a7AA0B10b98E6e7E5b172D2E1B55b2e";

let deployerContract = new ethers.Contract(
  deployerAddress,
  deployerABI,
  provider
);

let lockerContract = new ethers.Contract(lockerAddress, lockerAbi, provider);

let airdropDeployerContract = new ethers.Contract(
  airdropDeployer,
  airdropDeployerABI,
  provider
);

// function getAllContributors () external view returns (User[] memory usersData){
export const isAddress = async (_address) => {
  let result = await ethers.utils.isAddress(_address);
  console.log("result", result);
  return result;
};

export const getUserAirdrops = async (userAddress) => {
  try {
    let contributions = await airdropDeployerContract.getUserContributions(
      userAddress
    );

    return contributions;
  } catch (error) {
    console.log(error, "getUserAirdrops");
  }
};

export const setUserAllocation = async (
  _addresses,
  _allocations,
  _contractAddress,
  walletType,
  walletProvider
) => {
  try {
    console.log(_addresses, _allocations, "addresses");
    let signer = await getSigner(walletType, walletProvider);
    let instance = await new ethers.Contract(
      _contractAddress,
      airdropABI,
      signer
    );

    let tx = await instance.setUserAllocation(_addresses, _allocations);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "handleAllocations");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const setVesting = async (
  _tge,
  _cyclePerc,
  _cycle,
  _contractAddress,
  walletType,
  walletProvider
) => {
  try {
    let signer = await getSigner(walletType, walletProvider);
    let instance = await new ethers.Contract(
      _contractAddress,
      airdropABI,
      signer
    );

    let tx = await instance.setVesting(
      ethers.utils.parseUnits(_tge, 2),
      ethers.utils.parseUnits(_cyclePerc, 2),
      _cycle
    );

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "handleAllocations");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const startAirdrop = async (
  startTime,
  _contractAddress,
  walletType,
  walletProvider
) => {
  try {
    let signer = await getSigner(walletType, walletProvider);
    let instance = await new ethers.Contract(
      _contractAddress,
      airdropABI,
      signer
    );

    let tx = await instance.startAirdrop(startTime);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "startAirdrop");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const cancelAirdrop = async (
  _contractAddress,
  walletType,
  walletProvider
) => {
  try {
    let signer = await getSigner(walletType, walletProvider);
    let instance = await new ethers.Contract(
      _contractAddress,
      airdropABI,
      signer
    );

    let tx = await instance.cancelAirdrop();

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "cancelAirdrop");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const claim = async (
  userAddress,
  _contractAddress,
  walletType,
  walletProvider
) => {
  try {
    let signer = await getSigner(walletType, walletProvider);
    let instance = await new ethers.Contract(
      _contractAddress,
      airdropABI,
      signer
    );

    let tx = await instance.claim(userAddress);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "claim");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const getAllContributors = async (_address) => {
  try {
    let instance = await new ethers.Contract(_address, airdropABI, provider);

    let data = await instance.getAllContributors();

    console.log(data, "all contributors");
    return data;
  } catch (error) {
    console.log(error, "getAllContributors");
  }
};

export const getAirdrops = async () => {
  try {
    let count = await airdropDeployerContract.airdropCount();

    let data = [];

    for (let i = 0; i < count; i++) {
      let newData = await getAirdropInfo(i);
      data.unshift(newData);
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error, "getAirdrops");
  }
};

export const getAirdropInfo = async (id) => {
  try {
    let newData = {
      name: "",
      image: "",
      description: "",
      token: "",
      decimals: "",
      totalToken: "",
      participants: "",
      cancelled: "",
      startDate: "",
      allocations: "",
      distributed: "",
      progress: "",
      status: "",
      admin: "",
      tokenName: "",
      tokenSymbol: "",
      tokenAddress: "",
      airdropAddress: "",
      id,
    };

    let airdropData = await airdropDeployerContract.getInfo(id);
    let extraData;
    try {
      let receipt = await axios.get(airdropData[4]);

      extraData = receipt.data;
    } catch (error) {
      console.log(error, "axios");
    }

    newData.name = extraData.title;
    newData.image = extraData.logo;
    newData.description = extraData.description;
    newData.token = airdropData[7];
    newData.decimals = airdropData[1];
    newData.participants = Number(airdropData[0][3]);
    newData.cancelled = Number(airdropData[0][7]) === 2;
    newData.startDate = Number(airdropData[0][0]);
    newData.allocations = Number(airdropData[0][1] / 10 ** airdropData[1]);
    newData.distributed = Number(airdropData[0][2] / 10 ** airdropData[1]);
    newData.progress = (newData.distributed * 100) / newData.allocations || 0;
    newData.status = Number(airdropData[0][7]);
    newData.admin = airdropData[5];
    newData.tokenName = airdropData[2];
    newData.tokenSymbol = airdropData[3];
    newData.tokenAddress = airdropData[6];
    newData.airdropAddress = airdropData[7];

    console.log(airdropData, "airdrop data", extraData, newData);

    return newData;
  } catch (error) {
    console.log(error, "getAirdropInfo");
  }
};

export const getNormalTokensLock = async () => {
  // { "Token": { name: "AAVE", icon: aaveIcon }, "Symbol": "AAVE", "Amount": "12.000.000.000", "Token Address": "0x5617...bf9", "Action": "/tokens/1", id: 1 },
  try {
    let count = await lockerContract.allNormalTokenLockedCount();

    let data = await lockerContract.getCumulativeNormalTokenLockInfo(
      "0",
      count
    );
    return data;
  } catch (error) {
    console.log(error, "getNormalTokensLock");
  }
};

// normalLocksForUser
// lpLocksForUser

export const getUserLocks = async (_address) => {
  try {
    let normalLocks = await lockerContract.normalLocksForUser(_address);
    let LpLocks = await lockerContract.lpLocksForUser(_address);

    console.log({ normalLocks, LpLocks }, "userLocks");

    return { normalLocks, LpLocks };
  } catch (error) {
    console.log(error, "getTokenLockRecord");
  }
};

export const getTokenLockRecord = async (_address) => {
  try {
    let count = await lockerContract.totalLockCountForToken(_address);

    let data = await lockerContract.getLocksForToken(_address, "0", count);
    return data;
  } catch (error) {
    console.log(error, "getTokenLockRecord");
  }
};

export const getLPTokensLock = async () => {
  try {
    let count = await lockerContract.allLpTokenLockedCount();

    let data = await lockerContract.getCumulativeLpTokenLockInfo("0", count);

    // for (let i = 0; i < count; i++) {
    //   let newData = await getLaunchpadInfo(i);
    //   data.unshift(newData);
    // }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error, "getLPTokensLock");
  }
};

const getLocksInfo = async () => {};

export const lock = async (params, walletType, walletProvider) => {
  try {
    let signer = await getSigner(walletType, walletProvider);

    let lockerInstance = new ethers.Contract(lockerAddress, lockerAbi, signer);

    let tx = await lockerInstance.lock(...params);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const unlock = async (id, walletType, walletProvider) => {
  try {
    let signer = await getSigner(walletType, walletProvider);

    let lockerInstance = new ethers.Contract(lockerAddress, lockerAbi, signer);

    let tx = await lockerInstance.unlock(id);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "unlock");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const checkLP = async (_address) => {
  try {
    let contract = new ethers.Contract(_address, pairAbi, provider);

    let factory = await contract.factory();
    let symbol0 = await getTokenSymbol(await contract.token0());
    let symbol1 = await getTokenSymbol(await contract.token1());
    let pair = `${symbol0}/${symbol1}`;

    return { factory, pair };
  } catch (error) {
    return false;
  }
};

export const checkTokenBalance = async (_address, userAddress) => {
  try {
    let contract = new ethers.Contract(_address, pairAbi, provider);

    let balance = await contract.balanceOf(userAddress);

    let decimals = await contract.decimals();
    let realBalance = await ethers.utils.formatEther(balance, decimals);

    return realBalance;
  } catch (error) {
    return false;
  }
};

export const deployToken = async (type, params, walletType, walletProvider) => {
  try {
    let signer = await getSigner(walletType, walletProvider);
    let abi;
    let bytecode;
    let args;
    let {
      name,
      symbol,
      decimals,
      totalSupply,
      charityAddress,
      taxFeeBps,
      liquidityFeeBps,
      charityFeeBps,
    } = params;

    if (type === 0) {
      abi = standardTokenAbi;
      bytecode = standardTokenByte;
      args = [
        name,
        symbol,
        decimals,
        ethers.utils.parseUnits(totalSupply, decimals),
      ];
    } else if (type === 1) {
      abi = liquidityTokenAbi;
      bytecode = liquidityTokenByte;
      args = [
        name,
        symbol,
        ethers.utils.parseUnits(totalSupply, 9),
        "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
        charityAddress,
        ethers.utils.parseUnits(taxFeeBps, 2),
        ethers.utils.parseUnits(liquidityFeeBps, 2),
        ethers.utils.parseUnits(charityFeeBps, 2),
      ];
    }

    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(abi, bytecode, signer);

    let value = ethers.utils.parseUnits("0.01", "ether");

    // Deploy an instance of the contract
    let contract = await factory.deploy(
      ...args,
      "0x153B202F6C6e570f13C27371CdA6Ae2c8768Dca6",
      value,
      { value }
    );

    let receipt = await contract.deployTransaction.wait();
    console.log("finish", receipt);

    return receipt;
  } catch (error) {
    console.log(error, "deployLiquidityToken");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const launchpadSchema = {
  name: "",
  image: "",
  desc: "",
  likes: 0,
  audited: false,
  verified: false,
  bnbPrice: 0,
  cap: [0, 0],
  progress: 0,
  liquidity: 0,
  lockup: 0,
  cancelled: false,
  startDate: 0,
  endDate: 0,
  category: "",
  score: 0,
  kyc: false,
  size: "",
  locked: "",
  lockPeriod: "",
  lockDuration: "",
  audit: "",
  website: "",
  social: { tg: "/", twitter: "/" },
  utility: "",
  privateSale: "",
  vesting: "",
  ratio: "",
  voteScore: "",
  level: "",
  id: "",
  admin: "",
  address: "",
  symbol: "",
  decimals: "",
  maxSupply: "",
  listPrice: "",
  buy: "",
  sold: "",
  status: "",
  tokenForSale: "",
  tokenForLiquidity: "",
  launchpadAddress: "",
  values: [],
  userContribution: 0,
};

export const launchpadDetails = async () => {
  try {
    let count = await deployerContract.launchpadCount();

    let data = [];

    for (let i = 0; i < count; i++) {
      let newData = await getLaunchpadInfo(i);
      data.unshift(newData);
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error, "launchpadDetails");
  }
};

export const getUserContributions = async (userAddress) => {
  try {
    let contributions = await deployerContract.getUserContributions(
      userAddress
    );

    return contributions;
  } catch (error) {
    console.log(error, "getUserContributions");
  }
};

export const getLaunchpadInfo = async (id) => {
  try {
    let newData = {
      name: "",
      image: "",
      desc: "",
      likes: 0,
      audited: false,
      verified: false,
      bnbPrice: 0,
      cap: [0, 0],
      progress: 0,
      liquidity: 0,
      lockup: 0,
      cancelled: false,
      startDate: 0,
      endDate: 0,
      category: "",
      score: 0,
      kyc: false,
      audit: false,
      size: "",
      locked: "",
      lockPeriod: "",
      lockDuration: "",
      audit: false,
      website: "",
      social: { tg: "/", twitter: "/" },
      utility: "",
      privateSale: "",
      vesting: "",
      ratio: "",
      voteScore: "",
      level: "",
      id: "",
      admin: "",
      address: "",
      symbol: "",
      decimals: "",
      maxSupply: "",
      listPrice: "",
      buy: "",
      sold: "",
      tokenForSale: "",
      tokenForLiquidity: "",
      launchpadAddress: "",
      status: "",
      values: [],
      userContribution: 0,
      level: "low",
    };

    let launchpadData = await deployerContract.getInfo(id);
    let extraData;
    try {
      let receipt = await axios.get(launchpadData._URIData);

      extraData = receipt.data;
    } catch (error) {
      console.log(error, "axios");
    }

    newData.symbol = launchpadData.symbol[0];
    newData.name = launchpadData.symbol[1];
    newData.decimals = launchpadData.decimals;
    newData.image = extraData.logo ? extraData.logo : senseiLogo;
    newData.maxSupply = launchpadData.data[12] / 10 ** launchpadData.decimals;
    newData.desc = extraData.description;
    newData.bnbPrice = launchpadData.data[0] / 10000;
    newData.category = extraData.category.title;
    newData.listPrice = launchpadData.data[1] / 10000;
    newData.ratio = `1BNB / ${launchpadData.data[1] / 10000}${
      launchpadData.symbol[0]
    }`;
    newData.cap = [
      Number(launchpadData.data[2]),
      Number(launchpadData.data[3]),
    ];
    newData.buy = [
      Number(launchpadData.data[4]),
      Number(launchpadData.data[5]),
    ];
    newData.sold = Number(launchpadData.data[10]);
    newData.likes = Number(launchpadData.data[11]);
    newData.progress = (launchpadData.data[10] * 100) / newData.cap[1] || 0;
    newData.liquidity = Number(launchpadData.data[9]);
    newData.lockup = Number(launchpadData.data[8]);
    newData.lockDuration = Number(launchpadData.data[8]);
    newData.tokenForSale = (newData.bnbPrice * newData.cap[1]) / 10 ** 18;
    newData.tokenForLiquidity =
      (newData.listPrice * newData.cap[1] * newData.liquidity) / 100 / 10 ** 18;
    newData.cancelled = launchpadData._status === 2;
    newData.status = launchpadData._status;
    newData.startDate = launchpadData.data[6] * 1000;
    newData.endDate = launchpadData.data[7] * 1000;
    newData.website = extraData.website;
    newData.social = { tg: extraData.telegram, twitter: extraData.twitter };
    newData.privateSale = launchpadData._whitelistActive;
    newData.admin = launchpadData._contractAdmin;
    newData.address = launchpadData._tokenAddress;
    newData.launchpadAddress = launchpadData.contractAddress;
    newData.values = [
      {
        title: "Presale",
        value: (newData.tokenForSale * 100) / newData.maxSupply,
        color: "#E1A155",
        id: 1,
        active: false,
      },
      {
        title: "Liquidity",
        value: (newData.tokenForLiquidity * 100) / newData.maxSupply,
        color: "#A1DCAB",
        id: 3,
        active: false,
      },
      {
        title: "Unlocked",
        value:
          ((newData.maxSupply -
            newData.tokenForLiquidity -
            newData.tokenForSale) *
            100) /
          newData.maxSupply,
        color: "#F00375",
        id: 0,
        active: false,
      },
      // { title: "Burnt", value: 37, color: "#0993EC", id: 2, active: false },
    ];
    newData.id = id;
    newData.audited = false;
    newData.verified = true;
    newData.userContribution = 0;

    console.log(launchpadData, "launchpad data", newData, "new data");

    return newData;
  } catch (error) {
    console.log("getLaunchpadInfo");
  }
};

export const buy = async (
  _amount,
  launchAddress,
  walletType,
  walletProvider
) => {
  try {
    let contractInstance = await launchpadContractInstance(
      launchAddress,
      walletType,
      walletProvider
    );

    let value = ethers.utils.parseUnits(_amount, "ether");

    let tx = await contractInstance.buy({ value });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const finishSale = async (
  type,
  launchAddress,
  walletType,
  walletProvider
) => {
  try {
    let contractInstance = await launchpadContractInstance(
      launchAddress,
      walletType,
      walletProvider
    );
    let tx;

    switch (type) {
      case "CANCEL":
        tx = await contractInstance.cancelSale();
        break;
      case "FINISH":
        tx = await contractInstance.finishSale();
        break;
      case "CLAIM":
        tx = await contractInstance.claim();
    }

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const createLaunchpad = async (
  launchpadDetails,
  walletType,
  walletProvider
) => {
  try {
    let instance = await deployerContractInstance(walletType, walletProvider);

    const {
      price,
      listingPrice,
      softCap,
      hardCap,
      minBuy,
      maxBuy,
      startTime,
      endTime,
      lockupPeriod,
      liquidityPerc,
      tokenDecimals,
      infoURL,
      tokenAddress,
      whitelist,
    } = launchpadDetails;

    let _prices = [
      ethers.utils.parseUnits(price, 4),
      ethers.utils.parseUnits(listingPrice, 4),
      // price,
      // listingPrice,
    ];
    let _caps = [
      ethers.utils.parseUnits(softCap, 4),
      ethers.utils.parseUnits(hardCap, 4),
    ];
    let _limits = [
      ethers.utils.parseUnits(minBuy, "ether"),
      ethers.utils.parseUnits(maxBuy, "ether"),
    ];
    let _times = [startTime, endTime];

    let tokensToDistribute = _prices[0] * _caps[1];
    let tokensToLiquidity = (_prices[1] * _caps[1] * liquidityPerc) / 100;
    let tokensNeeded =
      ((tokensToDistribute + tokensToLiquidity) * 10 ** tokenDecimals) /
      10 ** 18;

    console.log(_prices, _caps, tokensNeeded, "tokens needed");

    let tx = await instance.createLaunchpad(
      _prices,
      _caps,
      _limits,
      _times,
      lockupPeriod,
      liquidityPerc,
      infoURL,
      tokenAddress,
      whitelist,
      { value: ethers.utils.parseUnits("0.01", "ether") }
    );

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "createLaunchpad");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const approveDeployer = async (
  tokenAddress,
  type,
  walletType,
  walletProvider
) => {
  try {
    let instance = await tokenContractInstance(
      tokenAddress,
      walletType,
      walletProvider
    );

    let operator;

    switch (type) {
      case "LAUNCHPAD":
        operator = deployerAddress;
        break;
      case "AIRDROP":
        operator = airdropDeployer;
        break;

      default:
        operator = type;
        break;
    }

    let tx = await instance.approve(
      operator,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      { gasLimit: 100000 }
    );

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "approveDeployer");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const approveLocker = async (
  tokenAddress,
  walletType,
  walletProvider
) => {
  try {
    let instance = await tokenContractInstance(
      tokenAddress,
      walletType,
      walletProvider
    );

    let tx = await instance.approve(
      lockerAddress,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      { gasLimit: 100000 }
    );

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "approveDeployer");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const checkAllowance = async (userAddress, tokenAddress, _operator) => {
  try {
    let operator = "";
    switch (_operator) {
      case "DEPLOYER":
        operator = deployerAddress;
        break;
      case "LOCKER":
        operator = lockerAddress;
        break;
      case "AIRDROP":
        operator = airdropDeployer;
        break;
      default:
        operator = _operator;
        break;
    }
    let tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, provider);

    let receipt = await tokenInstance.allowance(userAddress, operator);

    return receipt > 0;
  } catch (error) {
    console.log(error, "checkAllowance");
  }
};

export const nativeBalance = async (userAddress) => {
  try {
    let receipt = await provider.getBalance(userAddress);

    return receipt;
  } catch (error) {
    console.log(error, "nativeBalance");
  }
};

export const createAirdrop = async (
  tokenAddress,
  infoURL,
  walletType,
  walletProvider
) => {
  try {
    let signer = await getSigner(walletType, walletProvider);

    let instance = await new ethers.Contract(
      airdropDeployer,
      airdropDeployerABI,
      signer
    );

    let tx = await instance.createAirdrop(tokenAddress, infoURL, {
      value: ethers.utils.parseUnits("0.01", "ether"),
    });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};
// reateAirdrop(
//   address _token,
//   string memory _URIData

const tokenContractInstance = async (
  tokenAddress,
  walletType,
  walletProvider
) => {
  if (walletType === "WALLET_CONNECT") {
    const web3Provider = new providers.Web3Provider(walletProvider);

    let signer = web3Provider.getSigner(0);

    return new ethers.Contract(tokenAddress, tokenAbi, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(tokenAddress, tokenAbi, signer);
  }
};

const deployerContractInstance = async (walletType, walletProvider) => {
  if (walletType === "WALLET_CONNECT") {
    const web3Provider = new providers.Web3Provider(walletProvider);

    let signer = web3Provider.getSigner(0);

    return new ethers.Contract(deployerAddress, deployerABI, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(deployerAddress, deployerABI, signer);
  }
};

const launchpadContractInstance = async (
  launchAddress,
  walletType,
  walletProvider
) => {
  if (walletType === "WALLET_CONNECT") {
    const web3Provider = new providers.Web3Provider(walletProvider);

    let signer = web3Provider.getSigner(0);

    return new ethers.Contract(launchAddress, launchpadABI, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(launchAddress, launchpadABI, signer);
  }
};

const getSigner = async (walletType, walletProvider) => {
  if (walletType === "WALLET_CONNECT") {
    const web3Provider = new providers.Web3Provider(walletProvider);

    return web3Provider.getSigner(0);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    return newProvider.getSigner(0);
  }
};

const getTokenSymbol = async (_address) => {
  try {
    let contract = new ethers.Contract(_address, standardTokenAbi, provider);

    let symbol = await contract.symbol();

    return symbol;
  } catch (error) {
    return "";
  }
};

export const getTokenBalance = async (userAddress, _address) => {
  try {
    let contract = new ethers.Contract(_address, standardTokenAbi, provider);

    let balance = await contract.balanceOf(userAddress);

    return balance;
  } catch (error) {
    return error;
  }
};
