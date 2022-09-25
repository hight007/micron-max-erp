import React, { Component, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiName, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import ReactToPrint from 'react-to-print';
import './JobCards.css'
import moment from 'moment/moment';

export default function JobCards(props) {
  const params = useParams();

  //ref
  const componentRef = useRef(null);

  const [listPo, setlistPo] = useState([])

  useEffect(() => {
    doGetPoData()
  }, [])

  const doGetPoData = async () => {
    const { listPo } = params
    try {
      const response = await httpClient.get(apiName.purchaseOrder.listPo + listPo)

      if (response.data.api_result === OK) {
        setlistPo(response.data.result)
      } else {

      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="ปริ้นใบสั่งงาน (Job Cards)" />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header bg-main">

                </div>
                <div className="card-body">
                  <ComponentToPrint
                    listPo={listPo}
                    ref={componentRef} />
                </div>
                <div className="card-footer">
                  <ReactToPrint
                    trigger={() => <button className="btn btn-primary">พิมพ์ใบคำสั่งงาน</button>}
                    content={() => componentRef.current}
                  />
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
            <th style={{ width: 10 }}>ITEM</th>
            <th>PO#</th>
            <th>CODE</th>
            <th style={{ width: '30%' }}>DESCRIPTION</th>
            <th>QTY</th>
            <th>นัดส่งงาน</th>
            <th>CUSTOMER</th>
          </tr>
        </thead>
      )

      const renderTableBody = (data) => {
        console.log('data', data);
        if (data) {
          return data.map((item, index) => (
            <tr>
              <td>{item.i != null ? <p style={{ visibility: 'hidden' }}>{index + 1}</p> : `${index + 1}.`}</td>
              <td>{item.purchaseOrderName}</td>
              <td>{item.drawing}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.commitDate ? moment(item.commitDate).format('DD MMM YY') : ''}</td>
              <td>{item.tbCustomer ? item.tbCustomer.customerName : ''}</td>
            </tr>
          ))
        }
      }

      return (
        <div className="page">
          <div className="subpage">
            <div style={{ textAlign: 'center' }}>
              <img
                src="/dist/images/MicromMax logo.jpg"
                style={{ opacity: "1", width: "20%", }}
              />
            </div>
            <div className="row" >
              <div className="col-md-12 text-center" style={{ border: "2px solid", borderColor: "gray", margin: 30 }}>
                <h2 style={{ marginTop: 10, padding: 5, backgroundColor: 'gray', color: "white" }}>
                  JOB ORDER CARD
                </h2>
                <table className="table table-bordered">
                  {renderHeader()}
                  <tbody>
                    {renderTableBody(item)}
                  </tbody>
                  <tr>
                    <th style={{ textAlign: 'left' }} colspan="7">ORDER DATE : {moment().format('DD MMM YYYY')}</th>
                  </tr>
                </table>

              </div>

            </div>
          </div>
        </div>
      )
    }

    const renderContent = () => {
      const data = doSplitDataEachPage()
      console.log(data);
      if (data) {
        return data.map((item, index) => (
          renderPageContent(item, index)
        ))
      }

    }

    const doSplitDataEachPage = () => {
      let data = []
      const listPo = this.props.listPo
      const dataPerPage = 9
      const maxLine = 9
      if (listPo.length > dataPerPage) {
        for (let index = 0; index < Math.ceil(listPo.length / dataPerPage); index++) {
          let element = listPo.slice(index * dataPerPage, (index * dataPerPage) + dataPerPage);
          const length = element.length
          if (length < maxLine) {
            for (let i = 0; i < maxLine - length; i++) {
              element.push({ i })

            }
          }
          data.push(element)
        }

      } else {
        const length = listPo.length
        if (length < maxLine) {
          for (let i = 0; i < maxLine - length; i++) {
            listPo.push({ i })

          }
        }
        data.push(listPo)
      }
      return data
    }

    return (
      <div>

        {renderContent()}
      </div>
    );
  }
}