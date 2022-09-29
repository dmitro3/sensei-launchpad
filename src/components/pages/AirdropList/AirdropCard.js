import { Link } from "react-router-dom";
import Badge from "../../common/Badge";

export default function AirdropCard({ item }) {
  return (
    <div className="card card--token">
      <div className="card__row">
        <img src={item?.image} alt={item?.name} className="card__image" />
        <Badge item={item} />
      </div>
      <h1 className="card__title">{item?.name}</h1>
      <ul className="card__list">
        <li className="card__item">
          <span>Token Name</span>
          <span>{item?.tokenName}</span>
        </li>
        <li className="card__item">
          <span>Total Token</span>
          <span>{item?.allocations}</span>
        </li>
        <li className="card__item">
          <span>Participants</span>
          <span>{item?.participants}</span>
        </li>
      </ul>
      <div className="card__row card__row--footer">
        <Link to={"/airdrop_list/" + item?.id} className="card__button button">
          View Airdrop
        </Link>
      </div>
    </div>
  );
}
