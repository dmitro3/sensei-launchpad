import React from "react";
import ReactDOM from "react-dom";
import "./fonts/stylesheet.css";
import "./scss/style.scss";
import App from "./App";
import { MoralisProvider } from "react-moralis";

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <MoralisProvider
        serverUrl="https://neychcwnlu85.usemoralis.com:2053/server"
        appId="wzO5YQHUHaymjZMnqplPQh6YAtsJZarrjaxrmraD"
      >
        <App />
      </MoralisProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
