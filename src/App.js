import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";


import { key } from "./constants";
import Swal from "sweetalert2";

//Main
import Header from "./components/main/Header";
import Sidebar from "./components/main/Sidebar";
import Footer from "./components/main/Footer";
import moment from "moment";

//Home
import Home from "./components/Home";

//Authen
import Login from "./components/authen/Login";

const showElement = (element) => {
  // const isLogined = localStorage.getItem(key.isLogined);
  const isLogined = "true";
  if (isLogined === "true") {
    return element;
  }
};

function App() {
  return (
    <BrowserRouter>
      
      {showElement(<Header />)}
      {showElement(<Sidebar />)}
      {/* Home */}
      <Routes>
        <Route path="/Home" element={<Home />} />
        {/* Authen */}
        <Route path="/Login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navigate to="/Login" />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Navigate to="/Login" />
            </RequireAuth>
          }
        />
      </Routes>
      {showElement(<Footer />)}
    </BrowserRouter>
  );
}

export default App;

function RequireAuth(props) {
  // check permission
  if (localStorage.getItem(key.isLogined) !== "true") {
    return <Navigate to="/Login" />;
  }

  //check time to login
  const loginTime = moment(localStorage.getItem(key.loginTime)).format(
    "DD-MMM-yyyy HH:mm:ss"
  );
  if (moment().diff(moment(loginTime), "h") > 4) {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);
    Swal.fire({
      icon: "info",
      title: "Oops...",
      text: "Login time out , please login again",
    }).then(() => {
      return <Navigate to="/Login" />;
    });
  }
  return props.children;
}
