import Arrow2 from "../../Icons/Arrow2";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useSmallScreen from "./../../hooks/useSmallScreen";
import truncate from "./../../services/truncate";

let empty = [
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000",
  0,
  0,
  "",
  "",
];

export default function ItemDetails({ lockers }) {
  let { id } = useParams();
  const [locker, setLocker] = useState(lockers[id] || empty);
  const smallScreen = useSmallScreen(768);

  //   useEffect(() => {
  //     if (locker && locker[2] === 0) {
  //       setLocker(lockers[id]);
  //     }
  //   }, [lockers]);

  return (
    <div className="details details--item container">
      <div className="details__header">
        <button className="details__back">
          <Arrow2 className="details__back-icon" />
        </button>
        <h1 className="title title--page">Token Details</h1>
      </div>
      <div className="details__wrapper">
        <h3 className="details__title">Lock info</h3>
        <ul className="details__list details__list--main">
          <li className="details__item">
            <span className="details__item-text">Token name</span>
            <span className="details__item-text details__item-text--value">
              {locker[4]}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Token Symbol</span>
            <span className="details__item-text details__item-text--value">
              {locker[4]}
            </span>
          </li>
          <li className="details__item">
            <span className="details__item-text">Total Amount Locked</span>
            <span className="details__item-text details__item-text--value">
              {(locker[2] / 10 ** locker[3]).toFixed(2)} {locker[4]}
            </span>
          </li>
          {/* <li className="details__item">
            <span className="details__item-text">Total Values Locked</span>
            <span className="details__item-text details__item-text--value">
              $160.918
            </span>
          </li> */}
          <li className="details__item">
            <span className="details__item-text">Token Address</span>
            <button className="details__item-text details__item-text--value details__item-text--copy">
              {smallScreen ? truncate(locker[0], 20) : locker[0]}
            </button>
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
        <h3 className="details__title details__title--2">Lock records</h3>
        <div className="items__list-wrapper">
          {!smallScreen && (
            <div className="items__list-header">
              <div className="items__title items__column items__column--1">
                Wallet address
              </div>
              <div className="items__title items__column items__column--2">
                Amount
              </div>
              <div className="items__title items__column items__column--3">
                Unlock time
              </div>
              <div className="items__title items__column items__column--5">
                Action
              </div>
            </div>
          )}
          <ul className="items__list">
            <li className="items__list-item">
              <div className="items__column items__column--1">
                {smallScreen && (
                  <div className="items__title">Wallet address</div>
                )}
                <span className="items__text">0x5617...bf9</span>
              </div>
              <div className="items__column items__column--2">
                {smallScreen && <div className="items__title">Amount</div>}
                <span className="items__text">12.000.000.000</span>
              </div>
              <div className="items__column items__column--3">
                {smallScreen && <div className="items__title">Unlock time</div>}
                <span className="items__text">2022.02.02 01:00 UTC</span>
              </div>
              <div className="items__column items__column--4">
                {smallScreen && <div className="items__title">Action</div>}
                <Link to="/" className="items__text items__text--link">
                  View
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
