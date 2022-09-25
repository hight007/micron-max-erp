import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { key } from "../../../constants"

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu_purchaseOrder_render = () => {
    return (
      <li className="nav-item">
        <a
          className={`nav-link ${location.pathname.includes("purchaseOrder") ? "active" : ""
            }`}
        >
          <i className="nav-icon fas fa-shopping-cart" />

          <p>
            คำสั่งซื้อ
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/purchaseOrder/CreatePO")}
              className={
                location.pathname === "/purchaseOrder/CreatePO"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>เพิ่มคำสั่งซื้อ</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => navigate("/purchaseOrder/ReportPO")}
              className={
                location.pathname === "/purchaseOrder/ReportPO"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>รายงานคำสั่งซื้อ</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_jobOrder_render = () => {
    return (
      <li className="nav-item">
        <a
          className={`nav-link ${location.pathname.includes("JobOrder") ? "active" : ""
            }`}
        >
          <i className="nav-icon fas fa-industry" />

          <p>
            คำสั่งงาน
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              // onClick={() => navigate("/JobOrder/jobCards")}
              className={
                location.pathname.includes("JobCards")
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>ปริ้นใบสั่งงาน</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_master_render = () => {
    const userLevel = localStorage.getItem(key.user_level)
    if (userLevel == 'admin' || userLevel == 'power') {
      return (
        <li className="nav-item">
          <a

            className={`nav-link ${location.pathname.includes("Master") ? "active" : ""
              }`}
          >
            <i className="nav-icon fas fa-tasks" />

            <p>
              มาสเตอร์
              <i className="right fas fa-angle-left" />
            </p>
          </a>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <a
                onClick={() => navigate("/Master/user")}
                className={
                  location.pathname === "/Master/user"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>จัดการผู้ใช้งาน</p>
              </a>
            </li>
            <li className="nav-item">
              <a
                onClick={() => navigate("/Master/Customer")}
                className={
                  location.pathname === "/Master/Customer"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>จัดการลูกค้า</p>
              </a>
            </li>
          </ul>
        </li>

      );
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 bg-main">
      <a
        onClick={() => {
          // navigate("/home");
          window.open("/home", "_blank");
        }}
        // href="/home"
        className="brand-link bg-main"
        style={{ cursor: "pointer" }}
      >
        <img
          src="/dist/images/MicromMax logo.jpg"
          alt="spectrumPro Logo"
          className="brand-image elevation-2 "
          style={{ opacity: "1" }}
        />
        <label className=" elevation-2" style={{ cursor: "pointer" }}>Micron max ERP</label>
        <span
          className="brand-text font-weight-light"
          style={{ visibility: "hidden" }}
        >
          {"_"}
        </span>
      </a>
      <div className="sidebar os-host os-theme-light os-host-resize-disabled os-host-transition os-host-overflow os-host-overflow-y os-host-scrollbar-horizontal-hidden">
        <div className="os-resize-observer-host observed">
          <div
            className="os-resize-observer"
            style={{ left: 0, right: "auto" }}
          />
        </div>
        <div
          className="os-size-auto-observer observed"
          style={{ height: "calc(100% + 1px)", float: "left" }}
        >
          <div className="os-resize-observer" />
        </div>
        <div
          className="os-content-glue"
          style={{ margin: "0px -8px", width: 249, height: 462 }}
        />
        <div className="os-padding">
          <div
            className="os-viewport os-viewport-native-scrollbars-invisible"
            style={{ overflowY: "scroll" }}
          >
            <div
              className="os-content"
              style={{ padding: "0px 8px", height: "100%", width: "100%" }}
            >
              <nav className="mt-2">
                <ul
                  class="nav nav-pills nav-sidebar flex-column nav-child-indent nav-compact"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {menu_purchaseOrder_render()}
                  {menu_jobOrder_render()}
                  {menu_master_render()}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-auto-hidden os-scrollbar-unusable">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ width: "100%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ height: "44.9525%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar-corner" />
      </div>
    </aside>
  );
};

export default Sidebar;
