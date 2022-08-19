import Globe from "./../../Icons/Globe";
import Telegram from "./../../Icons/Telegram";
import Twitter from "./../../Icons/Twitter";
import discord from "./../../Icons/discord.png";
import facebook from "./../../Icons/facebook.webp";
import github from "./../../Icons/github.png";
import instagram from "./../../Icons/instagram.png";
import reddit from "./../../Icons/reddit.jpg";

export default function Social({ token, className }) {
  return token ? (
    <ul className={"social " + (className ? className : "")}>
      {token.website && (
        <li className="social__item">
          <a
            href={
              token.website.split(":")[0] == "https"
                ? token.website
                : `https://${token.website}`
            }
            target="_blank"
            className="social__link"
          >
            <Globe className="social__icon" />
          </a>
        </li>
      )}

      {token.social?.tg && (
        <li className="social__item">
          <a href={token.social?.tg} className="social__link">
            <Telegram className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.twitter && (
        <li className="social__item">
          <a href={token.social?.twitter} className="social__link">
            <Twitter className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.discord && (
        <li className="social__item">
          <a href={token.social?.discord} className="social__link">
            <img src={discord} alt="discord" className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.facebook && (
        <li className="social__item">
          <a href={token.social?.facebook} className="social__link">
            <img src={facebook} alt="facebook" className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.github && (
        <li className="social__item">
          <a href={token.social?.github} className="social__link">
            <img src={github} alt="github" className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.instagram && (
        <li className="social__item">
          <a href={token.social?.instagram} className="social__link">
            <img src={instagram} alt="instagram" className="social__icon" />
          </a>
        </li>
      )}
      {token.social?.reddit && (
        <li className="social__item">
          <a href={token.social?.reddit} className="social__link">
            <img src={reddit} alt="reddit" className="social__icon" />
          </a>
        </li>
      )}
    </ul>
  ) : (
    ""
  );
}
