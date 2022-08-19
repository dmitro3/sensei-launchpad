import { useState, useEffect } from "react";
import AddTokenAddress from "../common/AddTokenAddress";
import Step2 from "./CreateLaunchpad2";
import Step3 from "./CreateLaunchpad3";
import Step4 from "./CreateLaunchpad4";
import Steps from "../common/Steps";
import { useNavigate, useParams } from "react-router-dom";
import { useMoralisWeb3Api } from "react-moralis";
import {
  checkAllowance,
  approveDeployer,
  createLaunchpad,
} from "../../blockchain/functions";
import { create } from "ipfs-http-client";

const projectId = "1xqn5K7B9K3GiKPouHjJQafymbR";
const projectSecret = "001788eac00191371f6aababea7d08cf";

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export default function CreateLaunchpad({
  userAddress,
  walletType,
  walletProvider,
}) {
  const navigate = useNavigate();
  let { id } = useParams();
  const Web3Api = useMoralisWeb3Api();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
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
    category: "",
  });
  const [launchpadCreated, setLaunchpadCreated] = useState({
    address: "",
    tx: "",
  });

  const checkFields = () => {
    setErrors([]);
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
    } = launchDetails;

    if (
      !price ||
      !listingPrice ||
      !softCap ||
      !hardCap ||
      !minBuy ||
      !maxBuy ||
      !startTime ||
      !endTime ||
      !lockupPeriod ||
      !liquidityPerc
    ) {
      setErrors(["You need to fill all the required fields."]);
    } else {
      setStep(step + 1);
    }
  };

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
    setStep(step + 1);
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
      "DEPLOYER"
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
      "LAUNCHPAD",
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
    console.log("create", launchDetails);

    let receipt = await createLaunchpad(
      launchDetails,
      walletType,
      walletProvider
    );

    if (receipt) {
      let address = receipt.events[0].address;
      let tx = receipt.transactionHash;
      setLaunchpadCreated({ ...launchpadCreated, address, tx });

      // navigate("/launchpad_list");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkTokenAddress();
  }, [launchDetails.tokenAddress]);

  useEffect(() => {
    if (id) {
      setLaunchDetails({
        ...launchDetails,
        tokenAddress: id,
      });
    }
  }, []);

  return (
    <div className="launch container formContainer">
      <h1 className="title title--page">Create launchpad</h1>
      <Steps step={step} />
      {/* <Form className={"formContainer"}> */}
      {step === 1 && (
        <AddTokenAddress
          errors={errors}
          launchDetails={launchDetails}
          setLaunchDetails={setLaunchDetails}
          inputInfo="Create pool fee: 1 BNB"
        />
      )}
      {step === 2 && (
        <Step2
          errors={errors}
          launchDetails={launchDetails}
          setLaunchDetails={setLaunchDetails}
          inputInfo="Create pool fee: 1 BNB"
        />
      )}
      {step === 3 && (
        <Step3
          extraInfo={extraInfo}
          setExtraInfo={setExtraInfo}
          inputInfo="Create pool fee: 1 BNB"
        />
      )}
      {step === 4 && (
        <Step4
          launchpadCreated={launchpadCreated}
          launchDetails={launchDetails}
          setLaunchDetails={setLaunchDetails}
          inputInfo="Create pool fee: 1 BNB"
        />
      )}
      <div className="formButtons">
        <button
          disabled={step === 1 || isLoading}
          onClick={() => setStep(step - 1)}
          type="submit"
          className="button button--red form__submit"
        >
          Prev
        </button>
        <button
          disabled={!launchDetails.tokenDecimals || isLoading}
          onClick={
            step === 1 && !launchDetails.isAllowed
              ? handleApprove
              : step === 2
              ? checkFields
              : step === 3
              ? uploadInfo
              : launchpadCreated.tx
              ? () => navigate("/launchpad_list")
              : step === 4
              ? handleCreate
              : () => setStep(step + 1)
          }
          type="submit"
          className="button button--red form__submit"
        >
          {step === 1
            ? launchDetails.isAllowed
              ? "Next"
              : "Approve Token"
            : launchpadCreated.tx
            ? "See Launchpads"
            : step === 4
            ? "Create"
            : "Next"}
        </button>
      </div>
      {/* </Form> */}
    </div>
  );
}
