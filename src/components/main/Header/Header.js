import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../../constants";
import FontSizeChanger from "react-font-size-changer";

const Header = () => {
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user_id);
    localStorage.removeItem(key.user_level);
    localStorage.removeItem(key.username)
    navigate("/login");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-primary navbar-dark bg-main">
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
              stepSize: 3,
              range: 5,
            }}
            customButtons={{
              up: <span style={{ fontSize: "1.5em" }}>A</span>,
              down: <span style={{ fontSize: "0.8em" }}>A</span>,
              style: {
                backgroundColor: '#0098f1',
                color: "white",
                WebkitBoxSizing: "border-box",
                WebkitBorderRadius: "0.5em",
                width: "3em",
                // height: "2em",
              },
              buttonsMargin: 1,
            }}
          />
        </div>

        <li className="nav-item">
          <label className="nav-link">ชื่อผู้ใช้งาน : {localStorage.getItem(key.username)}</label>
        </li>
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
            {"ลงชื่อออก "}
            <i className="fas fa-sign-out-alt" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" role="button">
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
