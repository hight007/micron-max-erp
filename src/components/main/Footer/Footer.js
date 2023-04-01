import React from "react";
import version from '../../../../package.json'

const Footer = () => {
  return (
    <footer className="main-footer">
      
      <div className="float-right d-none d-sm-inline-block">
        <b >Version</b> {version.version}
      </div>
    </footer>
  );
};

export default Footer;
