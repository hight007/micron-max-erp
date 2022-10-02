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
import Home from "./components/main/Home";

//Authen
import Login from "./components/authen/Login";
import User from "./components/authen/User";

//purchaseOrder
import CreatePO from './components/purchaseOrder/CreatePO'
import ReportPO from './components/purchaseOrder/ReportPO'
import UpdatePO from './components/purchaseOrder/UpdatePO';

//Job Order
import JobCard from "./components/jobOrder/JobCards"
import JobTrackingCard from "./components/jobOrder/JobTrackingCard"

//master
import Customer from "./components/master/Customer"

const showElement = (element) => {
  const isLogined = localStorage.getItem(key.isLogined);
  if (isLogined == "true") {
    return element;
  }
};

function App() {

  const [value, setValue] = useState(0); // integer state

  const doForceUpdate = () => {
    try {
      setValue(value + 1);
    } catch (error) { }
  };

  return (
    <BrowserRouter>

      {showElement(<Header />)}
      {showElement(<Sidebar />)}
      {/* Home */}
      <Routes>
        <Route path="/Home" element={<RequireAuth><Home /></RequireAuth>} />
        {/* Authen */}
        <Route path="/Login" element={<Login forceUpdate={doForceUpdate} />} />
        <Route path="/Master/User" element={<RequireAuth userLevel={["admin", "power"]}><User /></RequireAuth>} />

        {/* PurchaseOrder */}
        <Route path="/PurchaseOrder/CreatePO" element={<RequireAuth userLevel={["admin", "power"]}><CreatePO /></RequireAuth>} />
        <Route path="/PurchaseOrder/ReportPO" element={<RequireAuth><ReportPO /></RequireAuth>} />
        <Route path="/PurchaseOrder/UpdatePO/:poNumber" element={<RequireAuth userLevel={["admin", "power"]}><UpdatePO /></RequireAuth>} />

        {/* JobOrder */}
        <Route path="/JobOrder/JobCards/:listPo" element={<RequireAuth ><JobCard /></RequireAuth>} />
        <Route path="/JobOrder/JobTrackingCards/:listPo" element={<RequireAuth><JobTrackingCard /></RequireAuth>} />

        {/* Master */}
        <Route path="/Master/Customer" element={<RequireAuth userLevel={["admin", "power"]}><Customer /></RequireAuth>} />

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
  const navigate = useNavigate();
  // check permission
  if (localStorage.getItem(key.isLogined) != "true") {
    window.location.replace('/Login');
  }

  //check time to login
  const loginTime = moment(localStorage.getItem(key.loginTime)).format(
    "DD-MMM-yyyy HH:mm:ss"
  );
  if (moment().diff(moment(loginTime), "h") > 4) {


    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "เวลาการเข้าใช้งานหมดอายุ โปรดลงชื่อเข้าใช้ใหม่",
    }).then(() => {
      localStorage.removeItem(key.isLogined);
      localStorage.removeItem(key.loginTime);
      localStorage.removeItem(key.token);
      localStorage.removeItem(key.user_id);
      localStorage.removeItem(key.user_level);
      localStorage.removeItem(key.username)
      navigate("/Login");
      return <Navigate to="/Login" />;
    });
  }

  //check user level
  if (props.userLevel) {
    const userLevel = localStorage.getItem(key.user_level)
    if (!props.userLevel.includes(userLevel)) {
      navigate("/Home");
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "ระดับไม่เพียงพอต่อการเข้าถึง",
      }).then(() => {
        return <Navigate to="/Home" />;
      });
    }

  }

  return props.children;
}
