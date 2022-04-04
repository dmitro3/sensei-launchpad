import Globe from "./../../Icons/Globe";
import Telegram from "./../../Icons/Telegram";
import Twitter from "./../../Icons/Twitter";

export default function Social({ token, className }) {
  return (
    <ul className={"social " + (className ? className : "")}>
      <li className="social__item">
        <a href={""} className="social__link">
          <Globe className="social__icon" />
        </a>
      </li>
      <li className="social__item">
        <a href={""} className="social__link">
          <Telegram className="social__icon" />
        </a>
      </li>
      <li className="social__item">
        <a href={""} className="social__link">
          <Twitter className="social__icon" />
        </a>
      </li>
    </ul>
  );
}
