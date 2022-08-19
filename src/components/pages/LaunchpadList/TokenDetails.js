import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import Countdown from "react-countdown";
import tokenImage from "../../../img/details/token.png";
import Badge from "../../common/Badge";
import BalanceInput from "../../common/BalanceInput";
import Arrow2 from "./../../../Icons/Arrow2";
import { launchpadsArray } from "./../../../services/constants";
import Social from "./../../common/Social";
import useChart from "../../../hooks/useChart";
import Select from "./../../common/Select";
import DSocial from "./../../../Icons/DSocial";
import Twitter from "../../../Icons/Twitter";
import Facebook from "./../../../Icons/Facebook";
import Google from "./../../../Icons/Google";
import Globe from "./../../../Icons/Globe";
import ArrowFilled from "./../../../Icons/ArrowFilled";
import useSmallScreen from "./../../../hooks/useSmallScreen";
import truncate from "../../../services/truncate";
import {
  buy,
  getLaunchpadInfo,
  finishSale,
  getUserContributions,
  initSale,
} from "../../../blockchain/functions";
import NumberFormat from "react-number-format";

const sortArray = [
  { title: "Sort by best", id: 0, selected: true },
  { title: "Sort by newest", id: 1, selected: false },
  { title: "Sort by oldest", id: 2, selected: false },
];

export default function TokenDetails({
  walletType,
  walletProvider,
  userBalance,
  getUserInfo,
  userAddress,
  setPopupShow,
  tokens,
}) {
  let { id, address } = useParams();
  const [token, setToken] = useState(
    tokens.find((el) => el.address === address) || launchpadsArray[0]
  );
  const [smartScore, setSmartScore] = useState("");
  const [KYC, setKYC] = useState(false);
  const [value, setValue] = useState("");
  const [comment, setComment] = useState("");
  const [chart, setChart] = useState([]);
  const smallScreen = useSmallScreen(1220);
  const mobileScreen = useSmallScreen(480);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    let receipt = await buy(
      value,
      token.launchpadAddress,
      walletType,
      walletProvider
    );
    if (receipt) {
      console.log(receipt);
      getUserInfo();
      let info = await getLaunchpadInfo(id);
      let contributions = await getUserContributions(userAddress);
      if (info) {
        let index = contributions[0].findIndex((e) => Number(e) === Number(id));
        console.log("contribution", contributions[1][index]);
        setToken({
          ...token,
          sold: info.sold,
          progress: info.progress,
          userContribution: contributions[1][index],
        });
      }
    }
    setIsLoading(false);
  };

  const handleInit = async () => {
    setIsLoading(true);
    let receipt = await initSale(
      smartScore,
      KYC,
      token.launchpadAddress,
      walletType,
      walletProvider
    );
    if (receipt) {
      console.log(receipt);
      let info = await getLaunchpadInfo(id);
      if (info) {
        setToken({ ...token, status: info.status });
      }
    }
    setIsLoading(false);
  };

  const handleFinish = async (type) => {
    setIsLoading(true);
    let receipt = await finishSale(
      type,
      token.launchpadAddress,
      walletType,
      walletProvider
    );
    if (receipt) {
      console.log(receipt);
      getUserInfo();
      let info = await getLaunchpadInfo(id);
      if (info) {
        setToken({ ...token, status: info.status });
      }
    }
    setIsLoading(false);
  };

  const getInfo = async () => {
    let info = await getLaunchpadInfo(id);
    if (info) {
      setToken(info);
    }
  };

  function handleChartArray(segmentIndex) {
    setChart((state) =>
      state.map((item, index) => ({ ...item, active: index === segmentIndex }))
    );
  }

  useEffect(() => {
    if (!token.id) {
      getInfo();
    }
  }, []);

  useEffect(() => {
    setChart(token.values);
  }, [token]);

  const countdownRenderer = ({ formatted }) => {
    return (
      <div className="countdown details__countdown">
        <div className="countdown__column countdown__column--1">
          <div className="countdown__time">{formatted.days}</div>
          <h6 className="countdown__title">day</h6>
        </div>
        <div className="countdown__column countdown__column--1">
          <div className="countdown__time">{formatted.hours}</div>
          <h6 className="countdown__title">hour</h6>
        </div>
        <div className="countdown__column countdown__column--1">
          <div className="countdown__time">{formatted.minutes}</div>
          <h6 className="countdown__title">min</h6>
        </div>
        <div className="countdown__column countdown__column--1">
          <div className="countdown__time">{formatted.seconds}</div>
          <h6 className="countdown__title">sec</h6>
        </div>
      </div>
    );
  };

  const graphLabel = (props) => {
    return (
      <foreignObject
        x={props.dx}
        y={props.dy + 40}
        width={mobileScreen ? "130px" : "90px"}
        height={mobileScreen ? "45px" : "30px"}
        key={props.dataIndex}
        style={{ display: chart[props.dataIndex].active ? "block" : "none" }}
      >
        <div
          className="chart__graph-label"
          style={{ color: chart[props.dataIndex].color }}
        >
          <span>
            {chart[props.dataIndex].title +
              " — " +
              Number(props.dataEntry.percentage).toFixed(
                props.dataEntry.percentage % 1 === 0 ? 0 : 1
              ) +
              "%"}
          </span>
        </div>
      </foreignObject>
    );
  };

  const getData = (time) => {
    let data = new Date(time).toString();
    let split = data.split(" ");

    return `${split[0]} ${split[1]} ${split[2]} ${split[3]} ${split[4]} ${split[5]}`;
  };

  return (
    <div className="details container">
      <div className="details__header">
        <Link to="/launchpad_list/">
          <button className="details__back">
            <Arrow2 className="details__back-icon" />
          </button>
        </Link>
        <h1 className="title title--page">Launchpad Details</h1>
      </div>
      <div className="details__column details__column--1">
        <div className="details__wrapper details__wrapper--1">
          <div className="details__top">
            <img src={token.image} className="details__image" alt="name" />
            <div className="details__top-column">
              <h1 className="details__title">{token.name} Presale</h1>
              <Social
                token={token}
                className="social--details details__social"
              />
            </div>
            <Badge item={token} />
          </div>
          <ul className="details__list details__list--main">
            <li className="details__item">
              <span className="details__item-text">Token Name</span>
              <span className="details__item-text details__item-text--value">
                {token.name}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Token Symbol</span>
              <span className="details__item-text details__item-text--value">
                {token.symbol}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Presale Address</span>
              <button className="details__item-text details__item-text--value details__item-text--copy">
                {smallScreen
                  ? truncate(token.launchpadAddress, 20)
                  : token.launchpadAddress}
              </button>
            </li>
            <li className="details__item">
              <span className="details__item-text">Token Decimals</span>
              <span className="details__item-text details__item-text--value">
                {token.decimals}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Token Address</span>
              <div className="details__item-column">
                <button className="details__item-text details__item-text--value details__item-text--copy">
                  {smallScreen ? truncate(token.address, 20) : token.address}
                </button>
                <div className="details__warning">
                  (Do not send BNB to the token address!)
                </div>
              </div>
            </li>
            <li className="details__item">
              <span className="details__item-text">Total Supply</span>
              <span className="details__item-text details__item-text--value">
                {token.maxSupply.toLocaleString()} {token.symbol}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Tokens For Presale</span>
              <span className="details__item-text details__item-text--value">
                {token.tokenForSale.toLocaleString()} {token.symbol}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Tokens For Liquidity</span>
              <span className="details__item-text details__item-text--value">
                {token.tokenForLiquidity.toLocaleString()} {token.symbol}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Presale Rate</span>
              <span className="details__item-text details__item-text--value">
                1 BNB = {`${token.bnbPrice.toLocaleString()} ${token.symbol}`}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Listing Rate</span>
              <span className="details__item-text details__item-text--value">
                1 BNB = {`${token.listPrice.toLocaleString()} ${token.symbol}`}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Soft Cap</span>
              <span className="details__item-text details__item-text--value">
                {token.cap[0] / 10 ** 18} BNB
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Hard Cap</span>
              <span className="details__item-text details__item-text--value">
                {token.cap[1] / 10 ** 18} BNB
              </span>
            </li>
            {/* <li className="details__item">
              <span className="details__item-text">Unsold Tokens</span>
              <span className="details__item-text details__item-text--value">
                Burn
              </span>
            </li> */}
            <li className="details__item">
              <span className="details__item-text">Presale Start Time</span>
              <span className="details__item-text details__item-text--value">
                {getData(token.startDate)}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Presale End Time</span>
              <span className="details__item-text details__item-text--value">
                {getData(token.endDate)}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Listing On</span>
              <a
                href="/"
                className="details__item-text details__item-text--value details__item-text--underline"
              >
                Pancakeswap
              </a>
            </li>
            <li className="details__item">
              <span className="details__item-text">Liquidity Percent</span>
              <span className="details__item-text details__item-text--value">
                {token.liquidity}%
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">
                Liquidity Unlocked Time
              </span>
              <span className="details__item-text details__item-text--value details__item-text--underline">
                {token.lockup} Days (After sales end)
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="details__column details__column--2">
        <div className="details__wrapper details__wrapper--2">
          <div className="details__info">
            Make sure the website is sansei.swap!
          </div>
          <div className="details__countdown-wrapper">
            <h5 className="details__countdown-title">
              {token.cancelled
                ? "Cancelled"
                : token.status === 0
                ? "Waiting for Approval :"
                : token.startDate < Date.now()
                ? token.endDate < Date.now()
                  ? "Sale Ended"
                  : "Presale Ends In"
                : "Presale Starts In"}
            </h5>
            {!token.cancelled &&
              token.status !== 0 &&
              token.endDate > Date.now() && (
                <Countdown
                  date={
                    token.startDate > Date.now()
                      ? new Date(token.startDate)
                      : new Date(token.endDate)
                  }
                  renderer={countdownRenderer}
                />
              )}

            <div className="progress details__progress">
              <div className="progress__bar">
                <div
                  className="progress__track"
                  style={{ width: `${token.progress}%` }}
                ></div>
              </div>
              <div className="progress__row">
                <span className="progress__text">
                  {token.sold / 10 ** 18} BNB
                </span>
                <span className="progress__text">
                  {token.cap[1] / 10 ** 18} BNB
                </span>
              </div>
            </div>
            {token.admin.toLowerCase() === userAddress.toLowerCase() ? (
              <>
                <h6>Admin Zone</h6>
                <button
                  disabled={token.status !== 0 || token.cancelled || isLoading}
                  onClick={
                    !userAddress
                      ? () => setPopupShow(true)
                      : () => handleFinish("CANCEL")
                  }
                  className="button button--red details__button"
                >
                  Cancel Sale
                </button>
                <button
                  disabled={
                    token.endDate > Date.now() || token.cancelled || isLoading
                  }
                  onClick={
                    !userAddress
                      ? () => setPopupShow(true)
                      : () => handleFinish("FINISH")
                  }
                  className="button button--red details__button"
                >
                  Finish Sale
                </button>
              </>
            ) : token.cancelled || token.status === 1 ? (
              <>
                <p className="input-wrapper__text">
                  Balance: {(userBalance / 10 ** 18).toFixed(4)} BNB
                </p>
                <button
                  disabled={isLoading}
                  onClick={
                    !userAddress
                      ? () => setPopupShow(true)
                      : () => handleFinish("CLAIM")
                  }
                  className="button button--red details__button"
                >
                  Claim
                </button>
              </>
            ) : (
              <>
                {Number(token.userContribution > 0) ? (
                  <>
                    <h6>
                      Your Contribution:
                      {(token.userContribution / 10 ** 18).toFixed(2)} BNB
                    </h6>
                    <br />
                  </>
                ) : (
                  ""
                )}

                <BalanceInput
                  userBalance={userBalance}
                  value={value}
                  onChange={(e) => setValue(e)}
                />
                <button
                  disabled={token.endDate < Date.now() || isLoading}
                  onClick={!userAddress ? () => setPopupShow(true) : handleBuy}
                  className="button button--red details__button"
                >
                  Buy
                </button>
              </>
            )}
          </div>
        </div>
        <div className="details__wrapper">
          <ul className="details__list">
            <li className="details__item">
              <span className="details__item-text">Status</span>
              <span className="details__item-text details__item-text--value details__item-text--underline">
                {token.startDate < Date.now()
                  ? token.endDate < Date.now()
                    ? "Sale Ended"
                    : "Sale Live"
                  : token.cancelled
                  ? "Cancelled"
                  : "Upcoming"}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Sale type</span>
              <span className="details__item-text details__item-text--value details__item-text--underline">
                {token.privateSale ? "Whitelist" : "Public"}
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Minimum Buy</span>
              <span className="details__item-text details__item-text--value">
                {token.buy[0] / 10 ** 18} BNB
              </span>
            </li>
            <li className="details__item">
              <span className="details__item-text">Maximum Buy</span>
              <span className="details__item-text details__item-text--value">
                {token.buy[1] / 10 ** 18} BNB
              </span>
            </li>
          </ul>
        </div>
        <div className="details__wrapper">
          <div className="chart">
            <h5 className="chart__title">Token Metrics</h5>
            <div className="chart__wrapper">
              <PieChart
                className="chart__graph"
                data={chart}
                onMouseOver={(e, segmentIndex) =>
                  handleChartArray(segmentIndex)
                }
                segmentsStyle={(index) => ({
                  transition: "stroke-width 0.1s ease-out",
                  cursor: "pointer",
                  strokeWidth: chart[index].active ? 22 : 15,
                })}
                label={graphLabel}
                labelPosition={82}
                lineWidth={10}
              />
              <img src={token.image} className="chart__image" alt="logo" />
            </div>
            <ul className="chart__labels">
              {chart.map((item, index) => {
                return (
                  <li
                    className={"chart__label" + (item.active ? " active" : "")}
                    key={index}
                    style={{ color: item.color }}
                    onMouseOver={() => handleChartArray(index)}
                  >
                    <span className="chart__label-title">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="details__wrapper">
          <div className="chart">
            <h5 className="chart__title">Approve Launchpad</h5>
            <br />
            <div className="input-wrapper__row">
              <input
                type="number"
                className="input-wrapper__input"
                value={smartScore}
                onChange={(e) =>
                  setSmartScore(
                    e.target.value > 100
                      ? 100
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
                placeholder="Smart Score"
              />
            </div>
            <br />
            <h5 className="chart__title">KYC</h5>
            <br />
            <label className="switch">
              <input
                type="checkbox"
                checked={KYC}
                onChange={(e) => setKYC(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>

            <button
              onClick={handleInit}
              className="button button--red details__button"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
      <div className="comments details__comments">
        <div className="details__wrapper">
          <div className="comments__top">
            <h1 className="comments__title">
              Comments <span>(2)</span>
            </h1>
            <Select
              list={sortArray}
              CustomArrow={ArrowFilled}
              className="select--comments"
            />
          </div>
          <label className="label label--comments">Your message</label>
          <textarea
            className="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Join the discussion..."
          />
          <div className="comments__row">
            <div className="comments__login">
              <span>Login with:</span>
              <ul className="comments__login-list">
                <li className="comments__login-item">
                  <button className="comments__login-button">
                    <DSocial className="comments__login-item" />
                  </button>
                </li>
                <li className="comments__login-item">
                  <button className="comments__login-button">
                    <Twitter className="comments__login-item" />
                  </button>
                </li>
                <li className="comments__login-item">
                  <button className="comments__login-button">
                    <Facebook className="comments__login-item" />
                  </button>
                </li>
                <li className="comments__login-item">
                  <button className="comments__login-button">
                    <Google className="comments__login-item" />
                  </button>
                </li>
              </ul>
            </div>
            <button className="button button--grey comments__button">
              Publish
            </button>
          </div>
          <ul className="comments__list">
            <li className="comments__item">
              <h4 className="comments__name">Ryan Stanton</h4>
              <div className="comments__item-columns">
                <div className="comments__item-date comments__item-column comments__item-column--1">
                  12/03/2019
                </div>
                <div className="comments__item-text comments__item-column comments__item-column--2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non enim
                  praesent elementum facilisis leo, vel fringilla est
                  ullamcorper eget nulla facilisi etiam dignissim diam quis
                  dolor sit amet, consectetur adipiscing elit ut aliquam
                </div>
              </div>
            </li>
            <li className="comments__item">
              <h4 className="comments__name">Ryan Stanton</h4>
              <div className="comments__item-columns">
                <div className="comments__item-date comments__item-column comments__item-column--1">
                  12/03/2019
                </div>
                <div className="comments__item-text comments__item-column comments__item-column--2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non enim
                  praesent elementum facilisis leo, vel fringilla est
                  ullamcorper eget nulla facilisi etiam dignissim diam quis
                  dolor sit amet, consectetur adipiscing elit ut aliquam
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
