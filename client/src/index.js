import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <HashRouter>
        <App/>
    </HashRouter>
);
export const serverUrl = () => {
    return process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://find-my-home-server.onrender.com'
}