import React, { useState } from "react";
import AddTokenAddress from "../common/AddTokenAddress";

export default function CreateAirdrop() {
  const [errors, setErrors] = useState([]);
  const [launchDetails, setLaunchDetails] = useState({
    price: "",
    listingPrice: "",
    whitelist: false,
    softCap: "",
    hardCap: "",
    minBuy: "",
    maxBuy: "",
    startTime: "",
    endTime: "",
    lockupPeriod: "",
    liquidityPerc: "",
    tokenAddress: "",
    tokenDecimals: "",
    tokenName: "",
    tokenSymbol: "",
    isAllowed: false,
    infoURL: "",
  });
  const [extraInfo, setExtraInfo] = useState({
    logo: "",
    website: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    description: "",
  });
  return (
    <div className="container">
      <h1 className="title title--page">Create Airdrop</h1>
      <AddTokenAddress
        errors={errors}
        launchDetails={launchDetails}
        setLaunchDetails={setLaunchDetails}
        inputInfo="Create airdrop fee: 0.5 BNB"
      />
    </div>
  );
}
