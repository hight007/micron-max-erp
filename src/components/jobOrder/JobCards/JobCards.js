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

  constructor(props) {
    super(props)

    this.state = {
      users: []
    };
  };

  componentDidMount = () => {
    this.getUsers();
  }

  getUsers = async () => {
    try {
      const response = await httpClient.get(apiName.user.allUsers)
      if (response.data.api_result === OK) {
        this.setState({ users: response.data.result })
      }

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const findUser = (user) => {
      if (user != null && this.state.users.length > 0) {
        const createdUser = _.find(this.state.users, { user_id: user })
        return createdUser.username
      } else {
        return ''
      }
    }

    const renderPageContent = (item, index) => {
      const targetPoPerPage = 7

      if (item.length < 8) {
        for (let i = item.length; i < targetPoPerPage; i++) {
          item.push({})
        }
      }
      console.log(item);

      const renderHeader = () => (
        <thead>
          <tr>
            <td style={{ textAlign: 'left' }} colspan="3"><b>ORDER DATE : </b>{moment().format('DD-MMM-YY')}</td>
            <td style={{ textAlign: 'left' }} colspan="3"><b>Customer : </b>{item[0]["tbCustomer.customerName"]}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }} colspan="3"><b>ชื่อเจ้าของงาน : </b>{item[0]["tbPurchaseOrderDetails.orderBy"]}</td>
            <td style={{ textAlign: 'left' }} colspan="3"><b>เบอร์ติดต่อ : </b>{item[0]["tbPurchaseOrderDetails.contactNumber"]}</td>
          </tr>
          <tr>
            <th style={{ width: '5%' }}>ITEM</th>
            <th style={{ width: '13%' }}>PO#</th>
            <th style={{ width: '16%' }}>CODE</th>
            <th>DESCRIPTION</th>
            <th style={{ width: '8%' }}>QTY</th>
            <th style={{ width: '11%' }}>นัดส่งงาน</th>
          </tr>
        </thead>
      )

      const renderTableBody = (data) => {

        if (data) {
          return data.map((item_, index) => {
            return (
              <tr>
                {/* <td>{item_.i != null ? <p style={{ visibility: 'hidden' }}>{index + 1}</p> : `${index + 1}.`}</td> */}
                <td>{item_['tbPurchaseOrderDetails.purchaseOrderDetailName'] ? item_['tbPurchaseOrderDetails.purchaseOrderDetailName'].substr(item_['tbPurchaseOrderDetails.purchaseOrderDetailName'].length - 4) : ''}</td>
                <td style={{ textAlign: 'left' }}>{item_.purchaseOrderName ?? ''}</td>
                <td style={{ textAlign: 'left' }}> {item_["tbPurchaseOrderDetails.drawing"] ?? ''}</td>
                <td style={{ textAlign: 'left' }}>{item_["tbPurchaseOrderDetails.description"] ?? ''}</td>
                <td>{item_["tbPurchaseOrderDetails.quantity"] ?? ''}</td>
                <td>{item_["tbPurchaseOrderDetails.commitDate"] ? moment(item_["tbPurchaseOrderDetails.commitDate"]).format('DD-MMM-YY') : <div style={{ visibility: 'hidden' }}>{moment().format('DD-MMM-YY')}</div>}</td>
              </tr>
            )
          })
        }
      }

      return (
        <div className="page">
          <div className="subpage">
            <div className="row" >
              <div className="col-md-12 text-center" style={{ border: "2px solid", borderColor: "gray", margin: 20 }}>
                <h5 style={{ marginTop: 10, padding: 5, backgroundColor: 'gray', color: "white" }}>
                  JOB ORDER CARD
                </h5>
                <table className="table table-bordered">
                  {renderHeader()}
                  <tbody>
                    {renderTableBody(item)}
                  </tbody>
                </table>
                <hr style={{ marginTop: 50, marginBottom: 50, border: '1px dashed' }}></hr>
                <h5 style={{ marginTop: 10, padding: 5, backgroundColor: 'gray', color: "white" }}>
                  JOB ORDER CARD
                </h5>
                <table className="table table-bordered">
                  {renderHeader()}
                  <tbody>
                    {renderTableBody(item)}
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

        return _(data).groupBy('customerId').values().value().map((item, index) => (
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