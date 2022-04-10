import Arrow2 from "../../Icons/Arrow2";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useSmallScreen from "./../../hooks/useSmallScreen";
import truncate from "./../../services/truncate";
import {
  getTokenLockRecord,
  unlock,
  checkLP,
} from "../../blockchain/functions";
import Countdown from "react-countdown";

let empty = [
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000",
  0,
  0,
  "",
  "",
];

export default function ItemDetails({
  lockers,
  getRegularLockers,
  userAddress,
  LP,
  walletType,
  walletProvider,
}) {
  const navigate = useNavigate();
  let { id } = useParams();
  let { record } = useParams();
  const [locker, setLocker] = useState(lockers[id] || empty);
  const [lockRecord, setLockRecord] = useState([]);
  const [singleRecord, setSingleRecord] = useState([]);
  const [pairName, setPairName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const getLockRecord = async () => {
    if (locker && locker[3]) {
      let receipt = await getTokenLockRecord(locker[0]);
      if (receipt) {
        let singleRecord = receipt.find(
          (el) => Number(el.id) === Number(record)
        );
        if (LP) {
          let pair = await checkLP(locker[0]);
          setPairName(pair.pair);
        }
        console.log(singleRecord, "single record", locker);
        setSingleRecord(singleRecord);
      }
    }
  };

  const getInitialLocker = async () => {
    if (locker[3] === 0) {
      let newLockers = await getRegularLockers();

      if (newLockers) {
        setLocker(newLockers[id]);
      }
    }
  };

  const handleUnlock = async () => {
    setIsLoading(true);
    let receipt = await unlock(record, walletType, walletProvider);

    if (receipt) {
      console.log(receipt);
      navigate(LP ? `/liquidity/${id}` : `/tokens/${id}`);
    }
    setIsLoading(false);
  };

  const smallScreen = useSmallScreen(768);

  const getData = (time) => {
    let data = new Date(time * 1000).toString();
    let split = data.split(" ");

    return `${split[0]} ${split[1]} ${split[2]} ${split[3]} ${split[4]} `;
  };

  useEffect(() => {
    getInitialLocker();
  }, []);

  useEffect(() => {
    getLockRecord();
  }, [locker]);

  return (
    <div className="details details--item formContainer container">
      <div className="details__header">
        <Link to={LP ? `/liquidity/${id}` : `/tokens/${id}`}>
          <button className="details__back">
            <Arrow2 className="details__back-icon" />
          </button>
        </Link>
        <h1 className="title title--page">Token Details</h1>
      </div>
      <div
        className="details__countdown-wrapper"
        style={{ marginBottom: "20px" }}
      >
        <h5 className="details__countdown-title">Unlocks In:</h5>

        <Countdown
          date={new Date(singleRecord.unlockDate * 1000)}
          renderer={countdownRenderer}
        />
      </div>
      <div className="details__wrapper">
        <h3 className="details__title">Token info</h3>
        <ul className="details__list details__list--main">
          <li className="details__item">
            <span className="details__item-text">Token Address</span>
            <button className="details__item-text details__item-text--value details__item-text--copy">
              {smallScreen ? truncate(locker[0], 20) : locker[0]}
            </button>
          </li>
          {LP && (
            <li className="details__item">
              <span className="details__item-text">LP Pair</span>
              <span className="details__item-text details__item-text--value">
                {pairName}
              </span>
            </li>
          )}
          <li className="details__item">
            <span className="details__item-text">Token Name</span>
            <span className="details__item-text details__item-text--value">
              {locker[4]}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Token Symbol</span>
            <span className="details__item-text details__item-text--value">
              {locker[5]}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Token Decimals</span>
            <span className="details__item-text details__item-text--value">
              {locker[3]}
            </span>
          </li>
        </ul>
      </div>
      <div className="details__wrapper details__wrapper--2 items items--details">
        <h3 className="details__title">Lock info</h3>
        <ul className="details__list details__list--main">
          <li className="details__item">
            <span className="details__item-text">Total Amount Locked</span>
            <span className="details__item-text details__item-text--value">
              {(singleRecord.amount / 10 ** locker[3]).toFixed(2)} {locker[5]}
            </span>
          </li>
          {/* <li className="details__item">
            <span className="details__item-text">Total Values Locked</span>
            <span className="details__item-text details__item-text--value">
              $160.918
            </span>
          </li> */}
          <li className="details__item">
            <span className="details__item-text">Owner</span>
            <span className="details__item-text details__item-text--value">
              {smallScreen
                ? truncate(singleRecord.owner, 20)
                : singleRecord.owner}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Lock Date</span>
            <span className="details__item-text details__item-text--value">
              {getData(singleRecord.lockDate)}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Unlock Date</span>
            <span className="details__item-text details__item-text--value">
              {getData(singleRecord.unlockDate)}
            </span>
          </li>
        </ul>
      </div>
      <div className="formButtons">
        <button
          disabled={
            Date.now() <= singleRecord.unlockDate * 1000 ||
            userAddress.toLowerCase() !== singleRecord.owner?.toLowerCase() ||
            isLoading
          }
          onClick={handleUnlock}
          type="submit"
          className="button button--red form__submit"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
