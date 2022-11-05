import React, { Component, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiName, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import moment from 'moment/moment';
import QRCode from "react-qr-code";
import LoadingScreen from '../../main/LoadingScreen';
import ReactToPrint from 'react-to-print';
import './JobTrackingCard.css'

export default function JobTrackingCard() {

  const params = useParams();
  const [isLoad, setisLoad] = useState(false)

  const componentRef = useRef(null);

  const [listPo, setlistPo] = useState([])

  useEffect(() => {
    doGetPoData()
  }, [])

  const doGetPoData = async () => {
    const { listPo } = params
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.purchaseOrder.jobTracking + listPo)

      if (response.data.api_result === OK) {
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
      <ContentHeader header="ปริ้นใบตามงาน (Job Tracking Cards)" />
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
                    trigger={() => <button className="btn btn-primary">พิมพ์ใบตามงาน</button>}
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
    const renderHeader = () => (
      <thead style={{ fontSize: 15 }}>
        <tr>
          {/* <th style={{ width: '5%' }}>No.</th> */}
          <th style={{ width: '5%' }}>รหัส</th>
          <th style={{ width: '9%' }}>วันที่สั่ง</th>
          <th style={{ width: '10%' }}>ใบสั่งซื้อ</th>
          <th style={{ width: '18%' }}>รายการ</th>
          <th style={{ width: '5%' }}>QTY</th>
          <th style={{ width: '10%' }}>ชื่อเจ้าของงาน</th>
          <th style={{ width: '9%' }}>วันนัดส่งลูกค้า</th>
          <th >ขั้นตอนการทำงาน</th>
          <th >หมายเหตุ</th>
        </tr>
      </thead>
    )

    const renderTableBody = () => {
      const data = this.props.listPo
      console.log(data);
      if (data) {
        return data.map((item, index) => (
          <tr style={{ fontSize: 12 }}>
            <td>
              {/* <QRCode
                size={16}
                value={item['tbPurchaseOrderDetails.purchaseOrderDetailNumber']} />
              <br /> */}
              {item['tbPurchaseOrderDetails.purchaseOrderDetailName'].substr(item['tbPurchaseOrderDetails.purchaseOrderDetailName'].length - 4)}</td>
            <td>{moment(item.purchaseOrderDate).format('DD-MMM-YY')}</td>
            <td>
              {/* <QRCode
                size={16}
                value={item.purchaseOrderName}
              /><br /> */}
              {item.purchaseOrderName}</td>

            <td>{item['tbPurchaseOrderDetails.description']}</td>
            <td>{item['tbPurchaseOrderDetails.finishedQuantity']}/{item['tbPurchaseOrderDetails.quantity']}</td>
            <td>{item['tbPurchaseOrderDetails.orderBy']}</td>
            <td>{moment(item.commitDate).format('DD-MMM-YY')}</td>
            <td></td>
            <td></td>
          </tr>
        ))
      }
    }

    return (
      <div>
        <div className="page ">
          <div className="subpage">
            <div className="row" >
              <div className="col-md-12 text-center" style={{ border: "2px solid", borderColor: "gray", margin: 30 }}>
                <h2 style={{ marginTop: 10, padding: 5, backgroundColor: 'gray', color: "white" }}>
                  ใบตามงาน
                </h2>
                <table className="table table-bordered">
                  {renderHeader()}
                  <tbody style={{ fontSize: 9 }}>
                    {renderTableBody()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}