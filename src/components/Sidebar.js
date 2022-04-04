import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Wallet from "../Icons/Wallet";
import logoImage from "../img/common/logo.png";
import bscIcon from "../img/icons/bsc.png";
import Home from "./../Icons/Home";
import Rocket from "./../Icons/Rocket";
import Lock from "./../Icons/Lock";
import Balloon from "./../Icons/Balloon";
import Arrow from "./../Icons/Arrow";
import addToRefs from "./../services/addToRefs";
import { useLocation } from "react-router-dom";
import Social from "./common/Social";

const menu = [
  {
    title: "Home",
    to: "/",
    icon: Home,
    id: 0,
  },
  {
    title: "Launchpads",
    submenu: [
      { title: "Create launchpad", to: "/create_launchpad", id: 0 },
      //   { title: "Create fair launch", to: "/create_fairlaunch", id: 1 },
      { title: "Create token", to: "/create_token", id: 2 },
      { title: "Launchpad list", to: "/launchpad_list", id: 3 },
    ],
    icon: Rocket,
    id: 1,
  },
  {
    title: "Sensei Lock",
    submenu: [
      { title: "Create lock", to: "/create_lock", id: 0 },
      { title: "Tokens", to: "/tokens", id: 1 },
      { title: "Liquidity", to: "/liquidity", id: 2 },
    ],
    icon: Lock,
    id: 2,
  },
  {
    title: "Sensei Drop",
    submenu: [
      { title: "Create airdrop", to: "/create_airdrop", id: 0 },
      { title: "Airdrop list", to: "/airdrop_list", id: 1 },
    ],
    icon: Balloon,
    id: 3,
  },
];

export default function Sidebar({
  disconnectWallet,
  userAddress,
  setNetworkPopupShow,
  setPopupShow,
  menuVisible,
  setMenuVisible,
}) {
  const location = useLocation();
  const submenuLists = useRef([]);
  const [contentHeight, setContentHeight] = useState(menu.map((item) => 0));
  const [nightmode, setNightmode] = useState(false);

  function toggleContent(index) {
    let textHeight = submenuLists.current[index - 1].clientHeight;
    if (contentHeight[index] !== 0) {
      setContentHeight((state) =>
        state.map((item, itemIndex) => (itemIndex === index ? 0 : item))
      );
    } else {
      setContentHeight((state) =>
        state.map((item, itemIndex) => (itemIndex === index ? textHeight : 0))
      );
    }
  }

  function checkUrl(url) {
    let current_path = location.pathname;
    return url === current_path;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuVisible(false);
  }, [setMenuVisible, location.pathname]);

  return (
    <div className={"sidebar scrollwrapper" + (menuVisible ? " opened" : "")}>
      <div className="sidebar__inner">
        <div className="sidebar__wrapper">
          <Link to="/" className="sidebar__logo">
            <img src={logoImage} alt="logo" className="sidebar__logo-image" />
          </Link>
          <button
            className="sidebar__button sidebar__button--wallet"
            onClick={userAddress ? disconnectWallet : () => setPopupShow(true)}
          >
            <Wallet className="sidebar__button-icon" />
            <span>
              {userAddress
                ? `${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`
                : "Connect Wallet"}
            </span>
          </button>
          <button
            className="sidebar__button sidebar__button--net"
            onClick={() => setNetworkPopupShow(true)}
          >
            <img src={bscIcon} alt="BSC" className="sidebar__button-icon" />
            <span>BSC Mainnet</span>
          </button>
        </div>
        <ul className="sidebar__menu">
          {menu.map((item, index) => {
            return item.to ? (
              <li className="sidebar__menu-item" key={item.id}>
                <Link
                  to={item.to}
                  className={
                    "sidebar__menu-button" +
                    (checkUrl(item.to) ? " active" : "")
                  }
                  onClick={() => setContentHeight(menu.map((item) => 0))}
                >
                  <item.icon className="sidebar__menu-icon" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ) : (
              <li className="sidebar__menu-item" key={item.id}>
                <button
                  to="/"
                  className={
                    "sidebar__menu-button" +
                    (contentHeight[index] > 0 ? " active" : "")
                  }
                  onClick={() => toggleContent(index)}
                >
                  <item.icon className="sidebar__menu-icon" />
                  <span>{item.title}</span>
                  <Arrow className="sidebar__menu-arrow" />
                </button>
                {item.submenu && (
                  <div
                    className="sidebar__submenu"
                    style={{ height: contentHeight[index] }}
                  >
                    <ul
                      className="sidebar__submenu-list"
                      ref={(el) => addToRefs(el, submenuLists)}
                    >
                      {item.submenu.map((subItem) => {
                        return (
                          <li
                            className="sidebar__submenu-item"
                            key={subItem.id}
                          >
                            <Link
                              to={subItem.to}
                              className={
                                "sidebar__submenu-link" +
                                (checkUrl(subItem.to) ? " active" : "")
                              }
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <footer className="sidebar__footer sidebar__wrapper">
          <Social className="social--sidebar" />
          <button
            className={
              "sidebar__switcher switcher" + (nightmode ? " active" : "")
            }
            onClick={() => setNightmode(!nightmode)}
          >
            <div className="switcher__round" />
          </button>
        </footer>
      </div>
    </div>
  );
}
