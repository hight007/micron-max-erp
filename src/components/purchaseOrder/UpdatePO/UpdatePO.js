import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import ContentHeader from "../../main/ContentHeader/ContentHeader";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../main/LoadingScreen";


export default function UpdatePO(props) {
  const [isLoad, setisLoad] = useState(false)

  const [customers, setcustomers] = useState([])

  // const [purchaseOrderNumber, setpurchaseOrderNumber] = useState(null)
  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [purchaseOrderDate, setpurchaseOrderDate] = useState(null)
  const [requestDate, setrequestDate] = useState(null)
  const [commitDate, setcommitDate] = useState(null)
  const [drawing, setdrawing] = useState('')
  const [quantity, setquantity] = useState(0)
  const [description, setdescription] = useState('')
  const [micron, setmicron] = useState('')
  const [ext, setext] = useState('')
  const [customer, setcustomer] = useState('')
  const [unitPrice, setunitPrice] = useState(0)
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(null)
  const [comment, setcomment] = useState('')

  const params = useParams();

  useEffect(() => {
    doGetPo(params.poNumber)
  }, [])


  const doGetCustomer = async () => {
    try {
      const response = await httpClient.get(apiName.master.customer + 'getAll')
      if (response.data.api_result === OK) {
        setcustomers(response.data.result)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const renderInputPO = () => {
    const renderCustomerOption = () => {
      if (customers.length > 0) {
        return customers.map((item) => (
          <option value={item.customerId}>{item.customerName}</option>
        ))
      }
    }

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
        <DatePicker required className="form-control" selected={purchaseOrderDate} onChange={(date) => setpurchaseOrderDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ขอใบสั่งซื้อ (Request date)</label>
        <DatePicker required className="form-control" selected={requestDate} onChange={(date) => setrequestDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่นัดส่งงาน (Commit date)</label>
        <DatePicker required className="form-control" selected={commitDate} onChange={(date) => setcommitDate(moment(date).startOf('D').toDate())} />

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
        <DatePicker required className="form-control" selected={invoiceDate} onChange={(date) => setinvoiceDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-6">
        <i className="fas fa-user-check" style={{ marginRight: 10 }} />
        <label >
          ชื่อลูกค้า (Customer)</label>
        <select
          value={customer}
          onChange={(e) => setcustomer(e.target.value)}
          required
          className="form-control" >
          <option value="">---เลือกลูกค้า---</option>
          {renderCustomerOption()}
        </select>
      </div>
      <div className="form-group col-sm-6" >
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

  const doGetPo = async () => {
    try {
      setisLoad(true)
      await doGetCustomer()
      const response = await httpClient.get(apiName.purchaseOrder.po + params.poNumber)

      if (response.data.api_result === OK) {
        const result = response.data.result;
        console.log(result);
        setpurchaseOrderName(result.purchaseOrderName);
        setpurchaseOrderDate(moment(result.purchaseOrderDate).toDate());
        setrequestDate(moment(result.setrequestDate).toDate())
        setcommitDate(moment(result.commitDate).toDate())
        setdrawing(result.drawing)
        setext(result.ext)
        setunitPrice(result.unitPrice)
        setquantity(result.quantity)
        setdescription(result.description)
        setmicron(result.micron)
        setinvoiceNumber(result.invoiceNumber)
        setinvoiceDate(moment(result.invoiceDate).toDate())
        setcomment(result.comment);
        setcustomer(result.customerId)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  const doUpdatePo = async () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการแก้ไขคำสั่งซื้อ ${purchaseOrderName}`,
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
          const result = await httpClient.patch(apiName.purchaseOrder.po,
            {
              purchaseOrderNumber: params.poNumber,
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
              updatedBy: localStorage.getItem(key.user_id),
              comment,
              customerId: customer
            }
          )
          setisLoad(false)
          if (result.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `แก้ไขคำสั่งซื้อ ${purchaseOrderName} สำเร็จ`
            }).then(() => doGetPo());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `แก้ไขสั่งซื้อ ${purchaseOrderName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);

        } finally {
          setisLoad(false)
        }
      }
    })

  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="แก้ไขสั่งซื้อ (Update New Purchase Order)" />
      <section className="content">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row">
            <div className="col-md-12">
              <div className="card card-warning">
                <div className="card-header "></div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  doUpdatePo()
                }}>
                  <div className="card-body ">
                    {renderInputPO()}
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">ตกลง</button>
                    <button type="reset" onClick={() => doGetPo()} className="btn btn-default float-right">ยกเลิก</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
