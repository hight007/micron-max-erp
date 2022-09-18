import React, { useState, useEffect } from "react";
import ContentHeader from '../../main/ContentHeader/ContentHeader';
import LoadingScreen from '../../main/LoadingScreen';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import moment from "moment";
import { httpClient } from "../../../utils/HttpClient";

export default function ReportPO() {
  const [isLoad, setisLoad] = useState(false)

  const [dateFrom, setdateFrom] = useState(moment().add(-1, 'M').toDate())
  const [dateTo, setdateTo] = useState(new Date())
  const [dateType, setdateType] = useState('')

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [drawing, setdrawing] = useState('')
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [ext, setext] = useState('')
  const [micron, setmicron] = useState('')

  useEffect(() => {
    doGetPurchaseOrder()
  }, [])

  const doReset = () => {
    setdateFrom(moment().add(-1, 'M').toDate())
    setdateTo(new Date())
    setdateType('')
    setpurchaseOrderName('')
    setdrawing('')
    setinvoiceNumber('')
    setext('')
    setmicron('')
  }

  const doGetPurchaseOrder = async () => {
    try {
      let condition = {}
      if (dateType != '') {
        condition[dateType] = { dateFrom, dateTo }
      } else {
        if (purchaseOrderName == '' && drawing == '' && invoiceNumber == '' && ext == '' && micron == '') {
          condition.createdAt = { dateFrom, dateTo }
        }
      }




      const response = await httpClient.post(apiName.purchaseOrder.get, { condition })

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const renderSearchCondition = () => {
    return (
      <>
        <div className="col-md-12 " >
          <div className="card card-primary">
            <div className="card-header">
              <div className="card-title">
                ค้นหาตามวันที่ (Search by date)
              </div>
            </div>
            <div className="card-body row">
              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-th-list" style={{ marginRight: 10 }} />
                <label >ชนิดของวันที่ (Date type)</label>
                <select
                  value={dateType}
                  onChange={(e) => setdateType(e.target.value)}
                  className="form-control"
                >
                  <option value="">----เลือกชนิดวันที่----</option>
                  <option value="purchaseOrderDate">วันที่ออกใบสั่งซื้อ (Purchase Order date)</option>
                  <option value="requestDate">วันที่ขอใบสั่งซื้อ (Request date)</option>
                  <option value="commitDate">วันที่นัดส่งงาน (Commit date)</option>
                  <option value="invoiceDate">วันที่ออกใบส่งของ (Invoice date)</option>
                </select>
              </ div>
              <div className="form-group col-md-4 resizeable">
                <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
                <label >วันที่เริ่มต้น (Date from)</label>
                <DatePicker
                  className="form-control"
                  selected={dateFrom}
                  onChange={(date) => setdateFrom(date)}
                />

              </div>
              <div className="form-group col-md-4 resizeable">
                <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
                <label >วันที่สิ้นสุด (Date to)</label>
                <DatePicker
                  className="form-control"
                  selected={dateTo}
                  onChange={(date) => setdateTo(date)}
                />

              </div>

            </div>
          </div>

        </div>
        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header">
              <div className="card-title">
                ค้นหาตามชื่อ (Search by name)
              </div>
            </div>
            <div className="card-body row">
              <div className="form-group col-md-6 resizeable">
                <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
                <label >ใบสั่งซื้อ (Purchase Order)</label>
                <input
                  value={purchaseOrderName}
                  onChange={(e) => setpurchaseOrderName(e.target.value)}
                  className="form-control"
                />

              </ div>
              <div className="form-group col-md-6 resizeable">
                <i className="fas fa-pencil-ruler" style={{ marginRight: 10 }} />
                <label >
                  แบบแปลน (Drawing)</label>
                <input
                  value={drawing}
                  onChange={(e) => setdrawing(e.target.value)}
                  className="form-control" />
              </div>
              <div className="form-group col-md-6 resizeable">
                <label >μ Micron</label>
                <input
                  value={micron}
                  onChange={(e) => setmicron(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-6 resizeable">
                <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
                <label >ext </label>
                <input
                  value={ext}
                  onChange={(e) => setext(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-6 resizeable">
                <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
                <label >
                  เลขที่ใบส่งของ (Invoice Number)</label>
                <input
                  value={invoiceNumber}
                  onChange={(e) => setinvoiceNumber(e.target.value)}
                  required
                  className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderSearchResult = () => {
    return <>
      <div className="col-md-12">

      </div>
    </>
  }

  return (
    <div className="content-wrapper "><ContentHeader header="รายงานคำสั่งซื้อ (Report Purchase Order)" />
      <section className="content">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header bg-main">
                  <div className="card-title">
                    <i className="fas fa-search" style={{ marginRight: 10 }} />
                    เงื่อนไขการค้นหา (Search criteria)
                  </div>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" />
                    </button>
                  </div>

                </div>
                <div className="card-body row">
                  {renderSearchCondition()}
                </div>
                <div className="card-footer">
                  <button type="submit" onClick={(e) => doGetPurchaseOrder()} className="btn btn-primary">ค้นหา</button>
                  <button type="reset" className="btn btn-default float-right" onClick={() => doReset()} >ยกเลิก</button>
                </div>
              </div>
              <div className="card card-dark">
                <div className="card-header bg-main">
                  <div className="card-title">
                    <i className="fas fa-file" style={{ marginRight: 10 }} />

                    ผลการค้นหา (Search result)
                  </div>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" />
                    </button>
                  </div>

                </div>
                <div className="card-body row">
                  {renderSearchResult()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
