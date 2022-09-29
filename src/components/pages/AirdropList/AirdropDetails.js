import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import tokenImage from "../../../img/tokens/token.png";
import Badge from "../../common/Badge";
import Input from "../../common/Input";
import Arrow2 from "../../../Icons/Arrow2";
import { allAirdrops } from "../../../services/constants";
import Social from "../../common/Social";
import Paginate from "../../common/Paginate";
import useSmallScreen from "./../../../hooks/useSmallScreen";
import truncate from "./../../../services/truncate";
import Popup from "../../common/Popup";
import DateTimePicker from "react-datetime-picker";
import {
  getAllContributors,
  getAirdropInfo,
  addUserAllocation,
  setVesting,
  getTokenBalance,
  startAirdrop,
  checkAllowance,
  approveDeployer,
  cancelAirdrop,
  claim,
} from "../../../blockchain/functions";
import ReadString from "../../common/readString";
import { svgIcons } from "../../../Icons/svgIcons";

// const allocations = [
//   {
//     user: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
//     allocation: "500,000,000 EFT",
//     id: 0,
//   },
//   {
//     user: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
//     allocation: "500,000,000 EFT",
//     id: 1,
//   },
// ];

export default function AirdropDetails({
  userAddress,
  // setPopupShow,
  airdrops,
  walletType,
  walletProvider,
}) {
  let { id } = useParams();
  const [allocations, setAllocations] = useState([]);
  const [airdrop, setAirdrop] = useState(
    airdrops.find((el) => el.id === Number(id)) || allAirdrops[0]
  );
  const [startTime, setStartTime] = useState(new Date());
  const smallScreen = useSmallScreen(1220);
  const [currentTab, setCurrentTab] = useState(0);
  const [popupShow, setPopupShow] = useState(false);
  const [vestingPopupShow, setVestingPopupShow] = useState(false);
  const [startPopupShow, setStartPopupShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("");
  const [isAllowed, setIsAllowed] = useState("");
  const [vestingSchedule, setVestingSchedule] = useState({
    tge: "",
    cyclePerc: "",
    cycle: "",
  });
  const [userAllocation, setUserAllocation] = useState({
    allocation: "",
    claimed: "",
    lastClaim: "",
  });

  const getData = (time) => {
    let data = new Date(time).toString();
    let split = data.split(" ");

    return `${split[0]} ${split[1]} ${split[2]} ${split[3]} ${split[4]} ${split[5]}`;
  };

  const getContributors = async () => {
    if (airdrop.airdropAddress) {
      let contributors = await getAllContributors(airdrop.airdropAddress);
      if (contributors) {
        setAllocations(contributors);
      }
    }
  };

  const getInfo = async () => {
    let info = await getAirdropInfo(id);
    if (info) {
      setAirdrop(info);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);

    let receipt = await approveDeployer(
      airdrop.tokenAddress,
      airdrop.airdropAddress
    );
    if (receipt) {
      console.log(receipt);
      getUserTokenBalance();
    }
    setIsLoading(false);
  };

  const handleAllocations = async (addresses, allocations) => {
    setIsLoading(true);
    let receipt = await addUserAllocation(
      addresses,
      allocations,
      airdrop.airdropAddress,
      walletType,
      walletProvider
    );
    setPopupShow(false);

    if (receipt) {
      console.log(receipt);
      getContributors();
      getInfo();
    }
    setIsLoading(false);
  };

  const getUserTokenBalance = async () => {
    if (userAddress) {
      let balance = await getTokenBalance(userAddress, airdrop.tokenAddress);
      let allowance = await checkAllowance(
        userAddress,
        airdrop.tokenAddress,
        airdrop.airdropAddress
      );
      console.log(allowance, "allowance");
      if (balance) {
        console.log(balance / 10 ** airdrop.decimals, "balance", balance);
        setTokenBalance((balance / 10 ** airdrop.decimals).toFixed(2));
        setIsAllowed(allowance);
      }
    }
  };

  const handleVesting = async (addresses, allocations) => {
    setIsLoading(true);
    let receipt = await setVesting(
      vestingSchedule.tge,
      vestingSchedule.cyclePerc,
      vestingSchedule.cycle,
      airdrop.airdropAddress,
      walletType,
      walletProvider
    );

    if (receipt) {
      setVestingPopupShow(false);
      console.log(receipt);
    }
    setIsLoading(false);
  };

  const handleStart = async () => {
    setIsLoading(true);
    let receipt = await startAirdrop(
      (startTime.getTime() / 1000).toFixed(0).toString(),
      airdrop.airdropAddress,
      walletType,
      walletProvider
    );

    if (receipt) {
      setStartPopupShow(false);
      getInfo();
      console.log(receipt);
    }

    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    let receipt = await cancelAirdrop(
      airdrop.airdropAddress,
      walletType,
      walletProvider
    );

    if (receipt) {
      getInfo();
      console.log(receipt);
    }

    setIsLoading(false);
  };

  const handleClaim = async () => {
    setIsLoading(true);
    let receipt = await claim(
      userAddress,
      airdrop.airdropAddress,
      walletType,
      walletProvider
    );

    if (receipt) {
      getUserAllocation();
      getInfo();
      console.log(receipt);
    }

    setIsLoading(false);
  };

  const getUserAllocation = async () => {
    if (userAddress && allocations) {
      let user = allocations.find(
        (el) => el.user.toLowerCase() === userAddress.toLowerCase()
      );
      console.log(user, "user");
      if (user) {
        setUserAllocation({
          ...userAllocation,
          allocation: (user.allocation / 10 ** airdrop.decimals).toFixed(2),
          claimed: (user.claimed / 10 ** airdrop.decimals).toFixed(2),
          lastClaim: user.lastClaim * 1000,
        });
      }
    }
  };

  const getTimeZone = () => {
    var timedifference = new Date().getTimezoneOffset();

    return `UTC ${timedifference < 0 ? "+" : ""}${timedifference / -60}`;
  };

  useEffect(() => {
    if (!airdrop.id) {
      getInfo();
    }
  }, []);

  useEffect(() => {
    getUserTokenBalance();
  }, [userAddress, airdrop.decimals]);

  useEffect(() => {
    getUserAllocation();
  }, [userAddress, allocations]);

  useEffect(() => {
    getContributors();
  }, [airdrop.airdropAddress]);

  return (
    <div className="details details--airdrop container">
      <div className="details__header">
        <button className="details__back">
          <Link to="/airdrop_list">
            <Arrow2 className="details__back-icon" />
          </Link>
        </button>
        <h1 className="title title--page">Airdrop Details</h1>
      </div>
      <div className="details__columns">
        <div className="details__column details__column--1">
          <div className="details__wrapper details__wrapper--1">
            <div className="details__top">
              <img src={airdrop.image} className="details__image" alt="name" />
              <div className="details__top-column">
                <h1 className="details__title">{airdrop.name}</h1>
                <Social className="social--details details__social" />
              </div>
              <Badge item={airdrop} className="details__badge" />
            </div>
            <p className="details__text">{airdrop.description}</p>
            <ul className="details__list details__list--main">
              <li className="details__item">
                <span className="details__item-text">Token Name</span>
                <span className="details__item-text details__item-text--value">
                  {airdrop.tokenName} Token
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Token Symbol</span>
                <span className="details__item-text details__item-text--value">
                  {airdrop.tokenSymbol}
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Total Tokens</span>
                <span className="details__item-text details__item-text--value">
                  {airdrop.allocations} {airdrop.tokenSymbol}
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Token Address</span>
                <button className="details__item-text details__item-text--value details__item-text--copy">
                  {smallScreen
                    ? truncate(airdrop.tokenAddress, 20)
                    : airdrop.tokenAddress}
                </button>
              </li>
              <li className="details__item">
                <span className="details__item-text">Airdrop Address</span>
                <button className="details__item-text details__item-text--value details__item-text--copy">
                  {smallScreen
                    ? truncate(airdrop.airdropAddress, 20)
                    : airdrop.airdropAddress}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="details__column details__column--2">
          <div className="details__wrapper details__wrapper--2">
            <h5 className="details__title details__title--small">
              Airdrop is live now
            </h5>
            <div className="progress progress--airdrop details__progress">
              <div className="progress__header">
                <h5>Progress:</h5>
                <span>{airdrop.progress}%</span>
              </div>
              <div className="progress__bar">
                <div
                  className="progress__track"
                  style={{ width: `${airdrop.progress}%` }}></div>
              </div>
              <div className="progress__row">
                <span className="progress__text">
                  {airdrop.distributed} {airdrop.tokenSymbol}
                </span>
                <span className="progress__text">
                  {airdrop.allocations} {airdrop.tokenSymbol}
                </span>
              </div>
            </div>
            <ul className="details__list details__list--2">
              <li className="details__item">
                <span className="details__item-text">Start Time</span>
                <span className="details__item-text details__item-text--value">
                  {airdrop.startDate ? getData(airdrop.startDate * 1000) : "-"}
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Your Allocation</span>
                <span className="details__item-text details__item-text--value">
                  {userAllocation.allocation}
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Your Claimed</span>
                <span className="details__item-text details__item-text--value">
                  {userAllocation.claimed}
                </span>
              </li>
            </ul>
            <button
              disabled={isLoading}
              onClick={handleClaim}
              className="button button--red details__button">
              Claim
            </button>
          </div>
        </div>
      </div>
      <div className="details__column details__column--1 details__wrapper">
        <h1 className="details__title">
          Allocations <span>({allocations.length})</span>
        </h1>
        <Paginate list={allocations}>
          {(currentItems) => {
            return (
              <ul className="details__list details__list--allocations details__list--main">
                {currentItems.map((item) => {
                  return (
                    <li className="details__item" key={item.id}>
                      <button className="details__item-text details__item-text--value details__item-text--copy details__item-text--copy--2">
                        {smallScreen ? truncate(item.user, 20) : item.user}
                      </button>
                      <span className="details__item-text details__item-text--value">
                        {Number(item.allocation / 10 ** airdrop.decimals)}{" "}
                        {airdrop.tokenSymbol}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        </Paginate>
      </div>
      {userAddress.toLowerCase() === airdrop.admin.toLowerCase() && (
        <div className="details__column details__column--2 details__admin">
          <div className="details__wrapper details__wrapper--2">
            <h5 className="details__title details__title--small">Admin Zone</h5>
            {airdrop.status === 1 ? (
              <ul className="details__list details__list--2">
                <li className="details__item">
                  <h1>Airdrop Started</h1>
                </li>
              </ul>
            ) : airdrop.status === 2 ? (
              <ul className="details__list details__list--2">
                <li className="details__item">
                  <h1>Airdrop Cancelled</h1>
                </li>
              </ul>
            ) : (
              <ul className="details__list details__list--2">
                <li className="details__item">
                  <button
                    disabled={isLoading}
                    onClick={() => setPopupShow(true)}
                    className="button button--red details__button">
                    Add Allocation
                  </button>
                </li>
                <li className="details__item">
                  <button
                    disabled={isLoading}
                    onClick={() => setVestingPopupShow(true)}
                    className="button button--red details__button">
                    Set Vesting
                  </button>
                </li>
                <li className="details__item">
                  <button
                    disabled={isLoading}
                    onClick={() => setStartPopupShow(true)}
                    className="button button--red details__button">
                    Start Airdrop
                  </button>
                </li>
                <li className="details__item">
                  <button
                    disabled={isLoading}
                    onClick={handleCancel}
                    className="button button--red details__button">
                    Cancel Airdrop
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
      <Popup
        popupShow={popupShow}
        setPopupShow={setPopupShow}
        className="popup--connect">
        <h1>Set Allocations</h1>

        <ReadString
          isLoading={isLoading}
          decimals={airdrop.decimals}
          handleAllocations={handleAllocations}
        />
      </Popup>
      <Popup
        popupShow={vestingPopupShow}
        setPopupShow={setVestingPopupShow}
        className="popup--connect">
        <h1>Set Vesting</h1>
        <div className="popup--allocation-box">
          <Input
            type="number"
            displayType="input"
            className="form__input-wrapper form__input-wrapper--first"
            placeholder=""
            title="TGE release percent (%)"
            name="rate"
            style={{ width: "100%" }}
            value={vestingSchedule.tge}
            onChange={(e) => {
              setVestingSchedule({ ...vestingSchedule, tge: e.target.value });
            }}
          />
          <Input
            type="number"
            displayType="input"
            className="form__input-wrapper form__input-wrapper--first"
            placeholder=""
            title="Cycle release percent (%)"
            name="rate"
            style={{ width: "100%" }}
            value={vestingSchedule.cyclePerc}
            onChange={(e) => {
              setVestingSchedule({
                ...vestingSchedule,
                cyclePerc: e.target.value,
              });
            }}
          />
          <Input
            type="number"
            displayType="input"
            className="form__input-wrapper form__input-wrapper--first"
            placeholder=""
            title="Cycle (seconds)"
            name="rate"
            style={{ width: "100%" }}
            value={vestingSchedule.cycle}
            onChange={(e) => {
              setVestingSchedule({ ...vestingSchedule, cycle: e.target.value });
            }}
          />
          <button
            disabled={isLoading}
            onClick={() => handleVesting()}
            className="button button--red details__button">
            Set Vesting
          </button>
        </div>
      </Popup>
      <Popup
        popupShow={startPopupShow}
        setPopupShow={setStartPopupShow}
        className="popup--connect">
        <h1>Setting time to start</h1>
        <div className="popup--allocation-box">
          <div style={{ width: "100%" }} className="items__buttons">
            <button
              className={"items__button" + (currentTab === 0 ? " active" : "")}
              onClick={() => setCurrentTab(0)}>
              Start Now
            </button>
            <button
              className={"items__button" + (currentTab === 1 ? " active" : "")}
              onClick={() => setCurrentTab(1)}>
              Start with specific time
            </button>
          </div>
          {currentTab === 1 && (
            <div className="" style={{ margin: "20px 0px" }}>
              <div className="input-wrapper__header">
                <label className="label label--required">
                  Start Date ({getTimeZone()})
                </label>
              </div>
              <div className="input-wrapper__row">
                <DateTimePicker
                  className={"calendar"}
                  onChange={(e) => {
                    setStartTime(e);
                  }}
                  disableClock={true}
                  calendarIcon={svgIcons.calendar}
                  value={startTime}
                />
              </div>
            </div>
          )}

          <h3>
            You need {airdrop.allocations} , your balance is {tokenBalance}{" "}
            {airdrop.tokenSymbol}
          </h3>
          <button
            disabled={isLoading}
            onClick={isAllowed ? handleStart : handleApprove}
            className="button button--red details__button">
            {isAllowed ? "Start Airdrop" : "Approve Token"}
          </button>
        </div>
      </Popup>
    </div>
  );
}
