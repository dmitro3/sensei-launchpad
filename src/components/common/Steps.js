export default function Steps({ step }) {
  return (
    <ul className="steps">
      <li className="steps__item steps__item-active">
        <h4 className="steps__title">Step 1</h4>
        <h1 className="steps__name">Verify Token</h1>
        <p className="steps__text">Enter the token address and verify</p>
      </li>
      <li
        className={step > 1 ? "steps__item steps__item-active" : "steps__item"}
      >
        <h4 className="steps__title">Step 2</h4>
        <h1 className="steps__name">DeFi Launchpad Info</h1>
        <p className="steps__text">
          Enter the launchpad information that you want to raise , that should
          be enter all details about your presale
        </p>
      </li>
      <li
        className={step > 2 ? "steps__item steps__item-active" : "steps__item"}
      >
        <h4 className="steps__title">Step 3</h4>
        <h1 className="steps__name">Add Additional Info</h1>
        <p className="steps__text">Let people know who you are</p>
      </li>
      <li
        className={step > 3 ? "steps__item steps__item-active" : "steps__item"}
      >
        <h4 className="steps__title">Step 4</h4>
        <h1 className="steps__name">Finish</h1>
        <p className="steps__text">Review your information</p>
      </li>
    </ul>
  );
}
