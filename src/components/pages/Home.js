export default function Home({ stats }) {
  return (
    <div className="home container">
      <h1 className="title title--home">
        The Launchpad Protocol for Everyone!
      </h1>
      <p className="home__text">
        Sensei Swap helps everyone to create their own tokens and token sales in
        few seconds. Tokens created on Sensei Swap will be verified and
        published on explorer websites.
      </p>
      <div className="home__buttons">
        <button className="button button--red home__button">Create Now</button>
        <button className="button button--grey home__button">Learn More</button>
      </div>
      <ul className="home__stats">
        <li className="home__stats-item">
          <div className="home__stats-name">Total Liquidity Raised</div>
          <div className="home__stats-value">{stats.invested} BNB</div>
        </li>
        <li className="home__stats-item">
          <div className="home__stats-name">Total Projects</div>
          <div className="home__stats-value">{stats.projects}</div>
        </li>
        <li className="home__stats-item">
          <div className="home__stats-name">Total Participants</div>
          <div className="home__stats-value">{stats.participants}</div>
        </li>
        <li className="home__stats-item">
          <div className="home__stats-name">Total Values Locked</div>
          <div className="home__stats-value">${stats.invested * 410}</div>
        </li>
      </ul>
    </div>
  );
}
