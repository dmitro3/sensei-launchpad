import NumberFormat from "react-number-format";

export default function BalanceInput({ userBalance, value, onChange }) {
  const truncateByDecimalPlace = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  return (
    <div className="input-wrapper input-wrapper--balance details__input-wrapper">
      <p className="input-wrapper__text">
        Balance: {truncateByDecimalPlace(userBalance / 10 ** 18, 4)} BNB
      </p>
      <div className="input-wrapper__row">
        <NumberFormat
          className="input-wrapper__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          allowLeadingZeros={false}
          allowNegative={false}
          placeholder="Your amount.."
        />
        <button
          onClick={() =>
            onChange(
              truncateByDecimalPlace(userBalance / 10 ** 18, 4).toString()
            )
          }
          className="input-wrapper__max"
        >
          MAX
        </button>
      </div>
    </div>
  );
}
