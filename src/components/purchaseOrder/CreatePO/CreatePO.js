import React, { useState, useEffect } from "react";
import ContentHeader from "../../main/ContentHeader/ContentHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../main/LoadingScreen";

export default function CreatePO() {
  const [isLoad, setisLoad] = useState(false)

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [purchaseOrderDate, setpurchaseOrderDate] = useState(new Date())
  const [requestDate, setrequestDate] = useState(null)
  const [commitDate, setcommitDate] = useState(null)
  const [drawing, setdrawing] = useState('')
  const [quantity, setquantity] = useState(0)
  const [description, setdescription] = useState('')
  const [micron, setmicron] = useState('')
  const [ext, setext] = useState('')
  const [unitPrice, setunitPrice] = useState(0)
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(new Date())
  const [comment, setcomment] = useState('')

  const renderInputPO = () => {
    return <div className="card-body resizeable row">
      <div className="col-sm-12" style={{ textAlign: 'center', marginBottom: 20 }}>
        <img
          src="/dist/images/MicromMax logo.jpg"
          alt="spectrumPro Logo"

          style={{ opacity: "1", width: "15%", }}
        />
        <hr />
      </div>

      <div className="form-group col-sm-6">
        <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
        <label >ใบสั่งซื้อ (Purchase Order)</label>
        <input
          value={purchaseOrderName}
          onChange={(e) => setpurchaseOrderName(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ออกใบสั่งซื้อ (Purchase Order date)</label>
        <DatePicker required className="form-control" selected={purchaseOrderDate} onChange={(date) => setpurchaseOrderDate(date)} />

      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ขอใบสั่งซื้อ (Request date)</label>
        <DatePicker required className="form-control" selected={requestDate} onChange={(date) => setrequestDate(date)} />

      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่นัดส่งงาน (Commit date)</label>
        <DatePicker required className="form-control" selected={commitDate} onChange={(date) => setcommitDate(date)} />

      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-pencil-ruler" style={{ marginRight: 10 }} />
        <label >
          แบบแปลน (Drawing)</label>
        <input
          value={drawing}
          onChange={(e) => setdrawing(e.target.value)}
          required
          className="form-control" />
      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />

        <label >ext </label>
        <input
          value={ext}
          onChange={(e) => setext(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-list-ol" style={{ marginRight: 10 }} />
        <label >
          จำนวน (Quantity)</label>
        <input
          type="number"
          step={1}
          min={1}
          value={quantity}
          onChange={(e) => setquantity(e.target.value)}
          required
          className="form-control" />
      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-money-bill-wave" style={{ marginRight: 10 }} />
        <label >
          ราคาต่อหน่วย (Unit price)</label>
        <input
          type="number"
          step={1}
          min={1}
          value={unitPrice}
          onChange={(e) => setunitPrice(e.target.value)}
          required
          className="form-control" />
      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-info" style={{ marginRight: 10 }} />
        <label >รายละเอียด (Description)</label>
        <textarea
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          required
          className="form-control"
          rows={3}
        />
      </div>
      <div className="form-group col-sm-6">
        <label >μ Micron</label>
        <textarea
          value={micron}
          onChange={(e) => setmicron(e.target.value)}
          required
          className="form-control"
          rows={3}
        />
      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
        <label >
          เลขที่ใบส่งของ (Invoice Number)</label>
        <input
          value={invoiceNumber}
          onChange={(e) => setinvoiceNumber(e.target.value)}
          required
          className="form-control" />
      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ออกใบส่งของ (Invoice date)</label>
        <DatePicker required className="form-control" selected={invoiceDate} onChange={(date) => setinvoiceDate(date)} />

      </div>
      <div className="form-group col-sm-12" >
        <i className="fas fa-comments" style={{ marginRight: 10 }} />

        <label >คอมเม้น (Comment)</label>
        <textarea
          value={comment}
          onChange={(e) => setcomment(e.target.value)}
          className="form-control"
          rows={3}
        />
      </div>
    </div>
  }

  const doReset = () => {
    setpurchaseOrderName('')
    setpurchaseOrderDate(new Date())
    setrequestDate(null)
    setcommitDate(null)
    setdrawing('')
    setquantity(0)
    setdescription('')
    setmicron('')
    setext('')
    setunitPrice(0)
    setinvoiceNumber('')
    setinvoiceDate(new Date())
    setcomment('')
  }

  const doCreatePO = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มคำสั่งซื้อ ${purchaseOrderName}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setisLoad(true)
          const result = await httpClient.post(apiName.purchaseOrder.po,
            {
              purchaseOrderName,
              purchaseOrderDate,
              requestDate,
              commitDate,
              drawing,
              quantity,
              description,
              micron,
              ext,
              unitPrice,
              invoiceNumber,
              invoiceDate,
              createdBy: localStorage.getItem(key.user_id),
              comment,
            }
          )
          setisLoad(false)
          if (result.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มคำสั่งซื้อ ${purchaseOrderName} สำเร็จ`
            }).then(() => doReset());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มคำสั่งซื้อ ${purchaseOrderName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="เพิ่มคำสั่งซื้อ (Add New Purchase Order)" />
      <section className="content">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header "></div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  doCreatePO()
                }}>
                  <div className="card-body ">
                    {renderInputPO()}
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">ตกลง</button>
                    <button type="reset" onClick={() => doReset()} className="btn btn-default float-right">ยกเลิก</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div >
  )
}
