import React from "react";
import ReactDOM from "react-dom";
import "./styles/main.scss";

// main app
import App from "./containers/App";

document.addEventListener("DOMContentLoaded", function() {
    ReactDOM.render(
        <App />,
        document.getElementById("app")
    );
});
