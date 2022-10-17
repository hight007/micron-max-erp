import React, { Component, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiName, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import ReactToPrint from 'react-to-print';
import './JobCards.css'
import moment from 'moment/moment';
import QRCode from "react-qr-code";
import LoadingScreen from '../../main/LoadingScreen';
import _ from 'lodash';

export default function JobCards(props) {
  const params = useParams();
  const [isLoad, setisLoad] = useState(false)

  //ref
  const componentRef = useRef(null);

  const [listPo, setlistPo] = useState([])

  useEffect(() => {
    doGetPoData()
  }, [])

  const doGetPoData = async () => {
    const { listPo } = params
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.purchaseOrder.listPo + listPo)

      if (response.data.api_result === OK) {
        // console.log(response.data.result);
        setlistPo(response.data.result)
      } else {

      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="ปริ้นใบสั่งงาน (Job Cards)" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header bg-main">

                </div>
                <div className="card-body">
                  <ReactToPrint
                    trigger={() => <button className="btn btn-primary">พิมพ์ใบคำสั่งงาน</button>}
                    content={() => componentRef.current}
                  />
                  <ComponentToPrint
                    listPo={listPo}
                    ref={componentRef} />
                </div>
                <div className="card-footer">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}



class ComponentToPrint extends Component {
  render() {
    const renderPageContent = (item, index) => {

      const renderHeader = () => (
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }} colspan="4">ORDER DATE : {moment().format('DD MMM YYYY')}</th>
            <th colspan="2" rowspan="2">
              <QRCode
                size={64}
                // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={item.purchaseOrderName}
              // viewBox={`0 0 256 256`}
              />
            </th>
          </tr>
          <tr>
            <th style={{ textAlign: 'left' }} colspan="4">Customer : {item.tbCustomer.customerName}</th>
          </tr>
          <tr>
            <th style={{ width: 10 }}>ITEM</th>
            <th>PO#</th>
            <th>CODE</th>
            <th style={{ width: '30%' }}>DESCRIPTION</th>
            <th>QTY</th>
            <th>นัดส่งงาน</th>
          </tr>
        </thead>
      )

      const renderTableBody = (data, purchaseOrderName, commitDate) => {

        if (data) {
          return data.tbPurchaseOrderDetails.map((item, index) => {
            return (
              <tr>
                <td>{item.i != null ? <p style={{ visibility: 'hidden' }}>{index + 1}</p> : `${index + 1}.`}</td>
                <td>{purchaseOrderName}</td>
                <td>{item.drawing}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{moment(commitDate).format('DD MMM YY')}</td>
              </tr>
            )
          })
        }
      }

      return (
        <div className="page ">
          <div className="subpage">
            <div className="row" >
              <div className="col-md-12 text-center" style={{ border: "2px solid", borderColor: "gray", margin: 30 }}>
                <h2 style={{ marginTop: 10, padding: 5, backgroundColor: 'gray', color: "white" }}>
                  JOB ORDER CARD
                </h2>
                <table className="table table-bordered">
                  {renderHeader()}
                  <tbody>
                    {renderTableBody(item, item.purchaseOrderName, item.commitDate)}
                  </tbody>

                </table>

              </div>

            </div>
          </div>
        </div>
      )
    }

    const renderContent = () => {
      const data = this.props.listPo
      if (data) {
        // console.log(data);
        return data.map((item, index) => (
          renderPageContent(item, index)
        ))
      }
    }

    return (
      <div>

        {renderContent()}
      </div>
    );
  }
}