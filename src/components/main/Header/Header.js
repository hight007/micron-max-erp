import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../../constants";
import FontSizeChanger from "react-font-size-changer";

const Header = () => {
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);

    navigate("/login");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-primary navbar-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <div style={{ cursor: "pointer" }}>
          <FontSizeChanger
            targets={[".resizeable"]}
            onChange={(element, newValue, oldValue) => {

            }}
            options={{
              stepSize: 8,
              range: 5,
            }}
            customButtons={{
              up: <span style={{ fontSize: "2em" }}>A</span>,
              down: <span style={{ fontSize: "1em" }}>A</span>,
              style: {
                backgroundColor: "gray",
                color: "white",
                WebkitBoxSizing: "border-box",
                WebkitBorderRadius: "5px",
                width: "4em",
              },
              buttonsMargin: 1,
            }}
          />
        </div>
        <li
          className="nav-item"
          onClick={(e) => {
            doLogout();
          }}
        >
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            role="button"
          >
            {"Logout "}
            <i className="fas fa-sign-out-alt" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
