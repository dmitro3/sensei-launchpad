import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import tokenImage from "../../../img/tokens/token.png";
import Badge from "../../common/Badge";
import Arrow2 from "../../../Icons/Arrow2";
import { launchpadsArray } from "../../../services/constants";
import Social from "../../common/Social";
import Paginate from "../../common/Paginate";
import useSmallScreen from "./../../../hooks/useSmallScreen";
import truncate from "./../../../services/truncate";
import Popup from "../../common/Popup";

const allocations = [
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 0,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 1,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 2,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 3,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 4,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 5,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 6,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 7,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 8,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 9,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 10,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 11,
  },
  {
    address: "0xEf6F6135F4fF3D3C1Bc559229214C8bCf1cc7a15",
    amount: "500,000,000 EFT",
    id: 12,
  },
];

export default function AirdropDetails({
  userAddress,
  // setPopupShow,
  airdrops,
  walletType,
  walletProvider,
}) {
  let { id } = useParams();
  const [airdrop, setAirdrop] = useState(
    airdrops.find((el) => el.id === Number(id)) || launchpadsArray[0]
  );
  const smallScreen = useSmallScreen(1220);
  const [popupShow, setPopupShow] = useState(false);

  const getData = (time) => {
    let data = new Date(time).toString();
    let split = data.split(" ");

    return `${split[0]} ${split[1]} ${split[2]} ${split[3]} ${split[4]} ${split[5]}`;
  };

  return (
    <div className="details details--airdrop container">
      <div className="details__header">
        <button className="details__back">
          <Arrow2 className="details__back-icon" />
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
                  style={{ width: `${airdrop.progress}%` }}
                ></div>
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
                  {airdrop.startDate ? getData(airdrop.startDate) : "-"}
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Your Allocation</span>
                <span className="details__item-text details__item-text--value">
                  0
                </span>
              </li>
              <li className="details__item">
                <span className="details__item-text">Your Claimed</span>
                <span className="details__item-text details__item-text--value">
                  0
                </span>
              </li>
            </ul>
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
                        {smallScreen
                          ? truncate(item.address, 20)
                          : item.address}
                      </button>
                      <span className="details__item-text details__item-text--value">
                        {item.amount}
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

            <ul className="details__list details__list--2">
              <li className="details__item">
                <button className="button button--red details__button">
                  Add Allocation
                </button>
              </li>
              <li className="details__item">
                <button className="button button--red details__button">
                  Set Vesting
                </button>
              </li>
              <li className="details__item">
                <button className="button button--red details__button">
                  Start Airdrop
                </button>
              </li>
              <li className="details__item">
                <button
                  onClick={() => setPopupShow(true)}
                  className="button button--red details__button"
                >
                  Cancel Airdrop
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      <Popup
        popupShow={popupShow}
        setPopupShow={setPopupShow}
        className="popup--connect"
      >
        this is a Pop Up
      </Popup>
    </div>
  );
}
