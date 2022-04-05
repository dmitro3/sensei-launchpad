import { useEffect, useState } from "react";
import Form from "../common/Form";
import Input from "../common/Input";
import DateTimePicker from "react-datetime-picker";
import { svgIcons } from "../../Icons/svgIcons";
import { useMoralisWeb3Api } from "react-moralis";
import {
  checkAllowance,
  checkLP,
  checkTokenBalance,
  lock,
  approveLocker,
  getNormalTokensLock,
  getLPTokensLock,
} from "../../blockchain/functions";
import { ethers } from "ethers";

export default function CreateLock({
  userAddress,
  walletType,
  walletProvider,
}) {
  const Web3Api = useMoralisWeb3Api();
  const [form, setForm] = useState({
    address: "",
    name: "",
    symbol: "",
    amount: "",
    balance: "",
    date: "",
    decimals: "",
    isLP: false,
    isAllowed: false,
  });
  const [startTime, setStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errors, setErrors] = useState([]);

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const checkTokenAddress = async () => {
    setIsLoading(true);
    if (form.address) {
      const options = {
        chain: "0x61",
        addresses: form.address,
      };
      const tokenMetadata = await Web3Api.token.getTokenMetadata(options);
      if (tokenMetadata[0].name) {
        console.log(tokenMetadata);
        let isLP = await checkLP(form.address);
        let allowance = await checkTokenAllowance(false);
        let balance = await checkTokenBalance(form.address, userAddress);
        console.log(
          {
            ...form,
            name: tokenMetadata[0].name,
            symbol: tokenMetadata[0].symbol,
            decimals: tokenMetadata[0].decimals,
            balance: Number(balance),
            isLP,
            isAllowed: allowance,
          },
          "token"
        );
        setForm({
          ...form,
          decimals: tokenMetadata[0].decimals,
          name: tokenMetadata[0].name,
          symbol: tokenMetadata[0].symbol,
          balance: balance,
          isLP,
          isAllowed: allowance,
        });
      } else {
        console.log("address not valid");
        setErrors(["address not valid"]);
        setForm({
          ...form,
          decimals: "",
          symbol: "",
          name: "",
          balance: "",
        });
      }
    }
    setIsLoading(false);
  };

  const checkTokenAllowance = async (update) => {
    console.log(userAddress, "address");
    let allowance = await checkAllowance(userAddress, form.address, "LOCKER");
    if (update) {
      setForm({
        ...form,
        isAllowed: allowance,
      });
    }

    return allowance;
  };

  const handleLock = async () => {
    setIsLoading(true);
    let lp = form.isLP ? true : false;
    let params = [
      userAddress,
      form.address,
      lp,
      ethers.utils.parseUnits(form.amount, form.decimals),
      form.date,
    ];
    let receipt = await lock(params, walletType, walletProvider);

    if (receipt) {
      console.log(receipt);
      setForm({
        ...form,
        address: "",
        amount: "",
        decimals: "",
        symbol: "",
        name: "",
        balance: "",
      });
    }
    setIsLoading(false);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    console.log("approve");
    let receipt = await approveLocker(form.address);
    if (receipt) {
      console.log(receipt);
      checkTokenAllowance(true);
    }
    setIsLoading(false);
  };

  function toggleTimeSelect() {
    setOpened((state) => !state);
  }

  useEffect(() => {
    checkTokenAddress();
  }, [form.address]);

  useEffect(() => {
    let getLockers = async () => {
      getNormalTokensLock();
      getLPTokensLock();
    };
    getLockers();
  }, []);

  useEffect(() => {
    function handleDocumentClick(e) {
      if (opened && !e.target.closest(".time")) {
        toggleTimeSelect();
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [opened]);

  return (
    <div className="lock container">
      <h1 className="title title--page">Create Lock</h1>
      <Form className="form--lock">
        <h2 className="title title--form form__title">Creating a new lock</h2>
        <div className="form__tip">
          ⭐️ Sensei Shib is audited by Certik:{" "}
          <a href="/">https://leaderboard.certik.io/projects/senseishib</a>
        </div>
        <Input
          value={form.address}
          className="form__input-wrapper"
          name="address"
          placeholder="Enter token or LP address"
          onChange={handleInput}
          title="Token or LP Token address"
        />
        <Input
          value={form.amount}
          className="form__input-wrapper"
          name="amount"
          placeholder="Ex: Sensei Swap"
          onChange={handleInput}
          title="Amount"
        />
        <div className="input-wrapper input-wrapper--icon form__input-wrapper">
          <div className="input-wrapper__header">
            <label className="label">Lock until (UTC)</label>
          </div>
          <div className="input-wrapper__row">
            <DateTimePicker
              className={"calendar"}
              onChange={(e) => {
                setStartTime(e);
                if (e) {
                  setForm({
                    ...form,
                    date: e.getTime() / 1000,
                  });
                }
              }}
              disableClock={true}
              calendarIcon={svgIcons.calendar}
              value={startTime}
            />
          </div>
        </div>
        <div className="divider"></div>
        {form.name && (
          <div>
            <p className="tokenDetails">Token Name: {form.name}</p>
            <p className="tokenDetails">
              Balance: {form.balance} {form.symbol}
            </p>
            {form.isLP && (
              <p className="tokenDetails">LP Token: {form.isLP.pair}</p>
            )}
          </div>
        )}
        <p className="form__info">You will pay: 0 BUSD</p>
        <button
          disabled={isLoading}
          onClick={form.isAllowed ? handleLock : handleApprove}
          className="button button--red form__button"
        >
          {form.isAllowed ? "Lock" : "Approve"}
        </button>
      </Form>
    </div>
  );
}
