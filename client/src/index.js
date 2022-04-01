import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

ReactDOM.render(
    <BrowserRouter>
        <ToastContainer limit={3} autoClose={4000} pauseOnHover={false} />
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
