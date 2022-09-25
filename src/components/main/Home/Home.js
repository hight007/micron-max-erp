import React, { Component } from "react";
import ContentHeader from "../ContentHeader/ContentHeader";

class Home extends Component {
  render() {
    return <div className="content-wrapper">
      <ContentHeader header="Home" />
      <section className="content">
        <div className="container-fluid">
          <div className="row" style={{ minHeight: '100%', margin: 10 }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <img style={{ width: '30%' }} src="/dist/images/MicromMax logo.jpg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  }
}

export default Home;
