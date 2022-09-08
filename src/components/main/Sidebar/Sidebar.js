import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="main-sidebar sidebar-light-primary elevation-4">
      <a
        onClick={() => {
          // navigate("/home");
          window.open("/home", "_blank");
        }}
        className="brand-link bg-primary"
        style={{ cursor: "pointer" }}
      >
        <img
          src="/src/images/spectrumPro-logo-white.png"
          alt="spectrumPro Logo"
          className="brand-image elevation-2 "
          style={{ opacity: "1" }}
        />
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
