import React, { useState, useEffect } from "react";
import AddTokenAddress from "../common/AddTokenAddress";
import ExtraInfo from "../../components/pages/CreateLaunchpad3";
import { useMoralisWeb3Api } from "react-moralis";
import {
  checkAllowance,
  approveDeployer,
  createLaunchpad,
  createAirdrop,
} from "../../blockchain/functions";
import { create } from "ipfs-http-client";

const projectId = "1xqn5K7B9K3GiKPouHjJQafymbR";
const projectSecret = "001788eac00191371f6aababea7d08cf";

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export default function CreateAirdrop({
  userAddress,
  setPopupShow,
  walletType,
  walletProvider,
}) {
  const Web3Api = useMoralisWeb3Api();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [launchDetails, setLaunchDetails] = useState({
    tokenAddress: "",
    tokenDecimals: "",
    tokenName: "",
    tokenSymbol: "",
    isAllowed: false,
    infoURL: "",
  });
  const [extraInfo, setExtraInfo] = useState({
    title: "",
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

  const uploadInfo = async () => {
    const client = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    });

    let jsonObj = JSON.stringify(extraInfo);

    const added = await client.add(jsonObj);
    console.log(added);
    setLaunchDetails({
      ...launchDetails,
      infoURL: `https://ipfs.io/ipfs/${added.path}`,
    });
    return `https://ipfs.io/ipfs/${added.path}`;
    // setStep(step + 1);
  };

  const checkTokenAddress = async () => {
    setIsLoading(true);
    if (launchDetails.tokenAddress) {
      const options = {
        chain: "0x61",
        addresses: launchDetails.tokenAddress,
      };
      const tokenMetadata = await Web3Api.token.getTokenMetadata(options);
      if (tokenMetadata[0].name) {
        console.log(tokenMetadata);
        let allowance = await checkTokenAllowance(false);
        console.log(allowance, "allowance");
        setLaunchDetails({
          ...launchDetails,
          tokenDecimals: tokenMetadata[0].decimals,
          tokenName: tokenMetadata[0].name,
          tokenSymbol: tokenMetadata[0].symbol,
          isAllowed: allowance,
        });
      } else {
        console.log("address not valid");
        setErrors(["address not valid"]);
        setLaunchDetails({
          ...launchDetails,
          tokenDecimals: "",
          tokenName: "",
          tokenSymbol: "",
        });
      }
    }
    setIsLoading(false);
  };

  const checkTokenAllowance = async (update) => {
    console.log(userAddress, "address");
    let allowance = await checkAllowance(
      userAddress,
      launchDetails.tokenAddress,
      "AIRDROP"
    );
    if (update) {
      setLaunchDetails({
        ...launchDetails,
        isAllowed: allowance,
      });
    }

    return allowance;
  };

  const handleApprove = async () => {
    setIsLoading(true);
    console.log("approve");
    let receipt = await approveDeployer(
      launchDetails.tokenAddress,
      "AIRDROP",
      walletType,
      walletProvider
    );
    if (receipt) {
      console.log(receipt);
      checkTokenAllowance(true);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    let infoURL = await uploadInfo();
    console.log("create", launchDetails);

    let receipt = await createAirdrop(
      launchDetails.tokenAddress,
      infoURL,
      walletType,
      walletProvider
    );

    if (receipt) {
      let address = receipt.events[0].address;
      let tx = receipt.transactionHash;
      console.log(receipt, address);
      // setLaunchpadCreated({ ...launchpadCreated, address, tx });

      // navigate("/launchpad_list");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkTokenAddress();
  }, [launchDetails.tokenAddress]);

  return (
    <div className="container formContainer">
      <h1 className="title title--page">Create Airdrop</h1>

      {step === 1 && (
        <AddTokenAddress
          errors={errors}
          launchDetails={launchDetails}
          setLaunchDetails={setLaunchDetails}
          inputInfo="Create airdrop fee: 0.5 BNB"
        />
      )}
      {step === 2 && (
        <ExtraInfo
          airdrop={true}
          extraInfo={extraInfo}
          setExtraInfo={setExtraInfo}
          inputInfo="Create pool fee: 1 BNB"
        />
      )}
      <div className="formButtons">
        <button
          disabled={step === 1 || isLoading}
          onClick={() => setStep(step - 1)}
          type="submit"
          className="button button--red form__submit">
          Prev
        </button>
        <button
          disabled={!launchDetails.tokenDecimals || isLoading}
          onClick={
            step === 1 && !launchDetails.isAllowed
              ? handleApprove
              : step === 3
              ? uploadInfo
              : // : launchpadCreated.tx
              // ? () => navigate("/launchpad_list")
              step === 2
              ? handleCreate
              : () => setStep(step + 1)
          }
          type="submit"
          className="button button--red form__submit">
          {step === 1
            ? launchDetails.isAllowed
              ? "Next"
              : "Approve Token"
            : // : launchpadCreated.tx
            // ? "See Launchpads"
            step === 2
            ? "Create"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
