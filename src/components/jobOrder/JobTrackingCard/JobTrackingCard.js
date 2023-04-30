import React, { Component, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiName, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import moment from 'moment/moment';
// import QRCode from "react-qr-code";
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
              <div className="card card-dark ">
                <div className="card-header bg-main">

                </div>

                <div className="card-body">
                  <ReactToPrint
                    trigger={() => <button className="btn btn-primary">พิมพ์ใบตามงาน</button>}
                    content={() => componentRef.current}
                    pageStyle={`@page {
                                  size: A4 landscape !important;
                                  margin: 0;
                              }`}
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
    const getColor = (piority) => {
      switch (piority) {
        case 1: return '#ff7c80'

        case 2: return '#fde499'

        default: return '#b5f0b3'

      }
    }
    const renderRemark = (text) => {
      const listText = text.split('\n')
      return listText.map(item => (
        <div>{item}</div>
      ))
    }
    const renderHeader = () => (
      <thead style={{ fontSize: 12 }}>
        <tr style={{}}>
          <th colspan="10" className="col-md-12 text-center" >
            <h2 style={{ border: "2px solid", borderColor: "gray", backgroundColor: 'gray', color: "white" }}>
              ใบตามงาน
            </h2>
          </th>
        </tr>
        <tr>
          {/* <th style={{ width: '5%' }}>No.</th> */}
          <th style={{ width: '4%' }}>รหัส</th>
          <th style={{ width: '8%' }}>วันที่สั่ง</th>
          <th style={{ width: '9%' }}>ใบสั่งซื้อ</th>
          <th style={{ width: '12%' }}>เลข DRG</th>
          <th style={{ width: '18%' }}>รายการ</th>
          <th style={{ width: '3%' }}>QTY</th>
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
        return data.map((item, index) => {
            return (
              <>
                <tr style={{ fontSize: 10 }}>
                  <td>
                    {item['tbPurchaseOrderDetails.purchaseOrderDetailName'].substr(item['tbPurchaseOrderDetails.purchaseOrderDetailName'].length - 4)}</td>
                  <td>{moment.utc(item['tbPurchaseOrderDetails.purchaseOrderDate']).local().add(0, 'd').format('DD-MMM-YY')}</td>
                  <td>{item.purchaseOrderName}</td>
                  <td>{item['tbPurchaseOrderDetails.drawing']}</td>
                  <td>{item['tbPurchaseOrderDetails.description']}</td>
                  <td>{item['tbPurchaseOrderDetails.finishedQuantity']}/{item['tbPurchaseOrderDetails.quantity']}</td>
                  <td>{item['tbPurchaseOrderDetails.orderBy']}</td>
                  <td><div  style={{ borderRadius: 10, paddingLeft: 10, backgroundColor: getColor(item['tbPurchaseOrderDetails.piority']) }}>{moment(item['tbPurchaseOrderDetails.commitDate']).format('DD-MMM-YY')}</div></td>
                  <td></td>
                  <td>{renderRemark(item['tbPurchaseOrderDetails.comment'])}</td>
                </tr>
              </>
            )
        })
      }
    }

    return (
      <div>
        <div className="page">
          <div className="subpage" style={{ width: '100%', height: '100%' }}>
            <div className="row" >
              <div className="col-md-12 text-center" style={{ border: "2px solid", borderColor: "gray", margin: 10 }}>

                <table className="table table-bordered" style={{ textAlign: 'left' }}>
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
