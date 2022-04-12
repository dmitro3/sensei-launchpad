import { useState } from "react";
import Input from "./Input";
import { Link } from "react-router-dom";
import emptyIcon from "../../img/sensei lock/empty.svg";
import Paginate from "./Paginate";
import useSmallScreen from "./../../hooks/useSmallScreen";

export default function Items({
  lockersLoading,
  className,
  list,
  tokens,
  userLocks,
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [search, setSearch] = useState("");
  const smallScreen = useSmallScreen(768);

  return (
    <div className={"items " + (className ? className : "")}>
      <div className="items__header">
        <div className="items__buttons">
          <button
            className={"items__button" + (currentTab === 0 ? " active" : "")}
            onClick={() => setCurrentTab(0)}
          >
            All
          </button>
          <button
            className={"items__button" + (currentTab === 1 ? " active" : "")}
            onClick={() => setCurrentTab(1)}
          >
            My lock
          </button>
        </div>
        <Input
          type="text"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          className="input-wrapper--search input-wrapper--items"
          placeholder="Search..."
        />
      </div>
      {lockersLoading && (
        <div className="loading-block">
          <h1>Loading last lockers...</h1>
        </div>
      )}
      {currentTab === 0 ? (
        list.length > 0 ? (
          <>
            <div className="items__list-wrapper">
              <Paginate list={list}>
                {(currentItems, index) => {
                  return (
                    <ul key={index} className="items__list">
                      {currentItems.map((el, index) => {
                        console.log(el, "element");
                        return (
                          <div key={index + 1000}>
                            <li className="items__list-item">
                              <div
                                className={
                                  "items__column items__column--" + (0 + 1)
                                }
                              >
                                {smallScreen && (
                                  <div className="items__title">Token</div>
                                )}
                                <span className="items__text">{el[4]}</span>
                              </div>
                              <div
                                className={
                                  "items__column items__column--" + (1 + 1)
                                }
                              >
                                {smallScreen && (
                                  <div className="items__title">Symbol</div>
                                )}
                                <span className="items__text">{el[5]}</span>
                              </div>
                              <div
                                className={
                                  "items__column items__column--" + (2 + 1)
                                }
                              >
                                {smallScreen && (
                                  <div className="items__title">Amount</div>
                                )}
                                <span className="items__text">
                                  {(el[2] / 10 ** el[3]).toFixed(2)}
                                </span>
                              </div>
                              <div
                                className={
                                  "items__column items__column--" + (3 + 1)
                                }
                              >
                                {smallScreen && (
                                  <div className="items__title">
                                    Token Address
                                  </div>
                                )}
                                <span className="items__text">
                                  {el[0].slice(0, 6)}...{el[0].slice(-6)}
                                </span>
                                {/* <button className="items__text items__text--copy">
                                {value}
                              </button> */}
                              </div>

                              <div
                                className={
                                  "items__column items__column--" + (4 + 1)
                                }
                              >
                                {smallScreen && (
                                  <div className="items__title">Action</div>
                                )}
                                <Link
                                  to={
                                    tokens
                                      ? `/tokens/${el[0]}`
                                      : `/liquidity/${el[0]}`
                                  }
                                  className="items__text items__text--link"
                                >
                                  <span className="items__text">View</span>
                                </Link>
                              </div>
                            </li>
                          </div>
                        );
                      })}
                    </ul>
                  );
                }}
              </Paginate>
            </div>
          </>
        ) : (
          <div className="items__empty">
            <img src={emptyIcon} className="items__empty-image" alt="empty" />
            <p className="items__empty-text">You don’t have any locks yet</p>
            <button className="button button--red items__empty-button">
              Create lock
            </button>
          </div>
        )
      ) : userLocks.length > 0 ? (
        <>
          <div className="items__list-wrapper">
            <Paginate list={userLocks}>
              {(currentItems, index) => {
                return (
                  <ul key={index} className="items__list">
                    {currentItems.map((el, index) => {
                      console.log(el, "element");
                      return (
                        <div key={index + 1000}>
                          <li className="items__list-item">
                            <div
                              className={
                                "items__column items__column--" + (0 + 1)
                              }
                            >
                              {smallScreen && (
                                <div className="items__title">Token</div>
                              )}
                              <span className="items__text">{el[4]}</span>
                            </div>
                            <div
                              className={
                                "items__column items__column--" + (1 + 1)
                              }
                            >
                              {smallScreen && (
                                <div className="items__title">Symbol</div>
                              )}
                              <span className="items__text">{el[5]}</span>
                            </div>
                            <div
                              className={
                                "items__column items__column--" + (2 + 1)
                              }
                            >
                              {smallScreen && (
                                <div className="items__title">Amount</div>
                              )}
                              <span className="items__text">
                                {(el[2] / 10 ** el[3]).toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={
                                "items__column items__column--" + (3 + 1)
                              }
                            >
                              {smallScreen && (
                                <div className="items__title">
                                  Token Address
                                </div>
                              )}
                              <span className="items__text">
                                {el[0].slice(0, 6)}...{el[0].slice(-6)}
                              </span>
                              {/* <button className="items__text items__text--copy">
                                {value}
                              </button> */}
                            </div>

                            <div
                              className={
                                "items__column items__column--" + (4 + 1)
                              }
                            >
                              {smallScreen && (
                                <div className="items__title">Action</div>
                              )}
                              <Link
                                to={
                                  tokens
                                    ? `/tokens/${el.parentIndex}/${Number(
                                        el.id
                                      )}`
                                    : `/liquidity/${el.parentIndex}/${Number(
                                        el.id
                                      )}`
                                }
                                className="items__text items__text--link"
                              >
                                <span className="items__text">View</span>
                              </Link>
                            </div>
                          </li>
                        </div>
                      );
                    })}
                  </ul>
                );
              }}
            </Paginate>
          </div>
        </>
      ) : (
        <div className="items__empty">
          <img src={emptyIcon} className="items__empty-image" alt="empty" />
          <p className="items__empty-text">You don’t have any locks yet</p>
          <button className="button button--red items__empty-button">
            Create lock
          </button>
        </div>
      )}
    </div>
  );
}
