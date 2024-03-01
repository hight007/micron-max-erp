import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import ContentHeader from "../../main/ContentHeader/ContentHeader";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../main/LoadingScreen";
import Modal from 'react-modal';
import MaterialReactTable from 'material-react-table';
import { NumericFormat } from 'react-number-format';
import _ from 'lodash';

export default function UpdatePO() {

  const [isLoad, setisLoad] = useState(false)

  const [customers, setcustomers] = useState([])
  const [poDetails, setpoDetails] = useState([])

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [purchaseOrderNumber, setpurchaseOrderNumber] = useState('')
  const [purchaseOrderDetailName, setpurchaseOrderDetailName] = useState('')
  const [purchaseOrderDate, setpurchaseOrderDate] = useState(null)
  const [requestDate, setrequestDate] = useState(null)
  const [commitDate, setcommitDate] = useState(null)
  const [contactNumber, setcontactNumber] = useState('')
  const [customer, setcustomer] = useState('')
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(null)
  const [quotationNumber, setquotationNumber] = useState('')
  const [drawing, setdrawing] = useState('')
  const [quantity, setquantity] = useState('')
  const [unitPrice, setunitPrice] = useState('')
  const [description, setdescription] = useState('')
  const [comment, setComment] = useState('')
  const [piority, setPiority] = useState('')
  const [orderBy, setorderBy] = useState('')
  const [finishedQuantity, setfinishedQuantity] = useState('')

  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    doGetCustomer()
    doGetPoDetail()
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

  const doGetPoDetail = async () => {
    try {
      const { poDetailNumber } = params
      setisLoad(true)
      const response = await httpClient.get(apiName.purchaseOrder.detail + 'detail=' + poDetailNumber)
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        setpoDetails(response.data.result)
        prepareUpdatePoDetail(response.data.result)
      }

    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
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
      <div className="form-group col-sm-4">
        <i className="fas fa-user-check" style={{ marginRight: 10 }} />
        <label >
          ชื่อลูกค้า (Customer)*</label>
        <select
          value={customer}
          onChange={async (e) => {
            setcustomer(e.target.value)
            // generatePoName(e.target.value, null);
          }}
          required
          className="form-control" >
          <option value="">---เลือกลูกค้า---</option>
          {renderCustomerOption()}
        </select>
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
        <label >ชื่อผู้สั่ง/ชื่อเจ้าของงาน</label>
        <input
          value={orderBy}
          onChange={(e) => setorderBy(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
        <label >เบอร์ติดต่อลูกค้า (contactNumber)</label>
        <input
          value={contactNumber}
          onChange={(e) => setcontactNumber(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ออกใบสั่งซื้อ (Purchase Order date)</label>
        <DatePicker className="form-control" selected={purchaseOrderDate} onChange={(date) => {
          date ? setpurchaseOrderDate(moment(date).startOf('D').toDate()) : setpurchaseOrderDate(date)
          // generatePoName(null, moment(date).startOf('D').toDate())
        }} />

      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
        <label >ใบสั่งซื้อ (Purchase Order)</label>
        <input
          required
          value={purchaseOrderName}
          onChange={(e) => setpurchaseOrderName(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ส่งในใบสั่งซื้อ (Request date)</label>
        <DatePicker className="form-control" selected={requestDate} onChange={(date) => date ? setrequestDate(moment(date).startOf('D').toDate()) : setrequestDate(date)} />

      </div>

      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่นัดส่งงาน (Commit date)*</label>
        <DatePicker required className="form-control" selected={commitDate} onChange={(date) => date ? setcommitDate(moment(date).startOf('D').toDate()) : setcommitDate(date)} />

      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
        <label >เลขที่ใบส่งของ (Invoice Number)</label>
        <input
          value={invoiceNumber}
          onChange={(e) => setinvoiceNumber(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ออกใบส่งของ (Invoice date)</label>
        <DatePicker className="form-control" selected={invoiceDate} onChange={(date) => date ? setinvoiceDate(moment(date).startOf('D').toDate()) : setinvoiceDate(date)} />

      </div>
      <div className="form-group col-sm-4">
        <label >เลขที่ใบเสนอราคา (Quotation Number)</label>
        <input value={quotationNumber} onChange={(e) => setquotationNumber(e.target.value)} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >แบบแปลน (Drawing)*</label>
        <input value={drawing} onChange={(e) => setdrawing(e.target.value)} required className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >No.</label>
        <input value={purchaseOrderDetailName} disabled className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >จำนวน (Quantity)</label>
        <input value={quantity} onChange={(e) => setquantity(e.target.value)} required min={1} type="number" className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >ราคาต่อหน่วย (Unit price)</label>
        <input value={unitPrice} onChange={(e) => setunitPrice(e.target.value)} required type="number" min={0} step={0.01} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >จำนวนที่เสร็จสิ้น (Finished Quantity)</label>
        <input value={finishedQuantity} onChange={(e) => setfinishedQuantity(e.target.value)} required type="number" min={0} max={quantity} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >รายละเอียด (Description)</label>
        <textarea rows={description.split('\n').length > 3 ? description.split('\n').length : 3} value={description} onChange={(e) => setdescription(e.target.value)} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >คอมเม้น (Comment)</label>
        <textarea rows={comment.split('\n').length > 3 ? comment.split('\n').length : 3} value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-sort-numeric-up-alt" style={{ marginRight: 10 }} />
        <label >ความสำคัญ (Piority)*</label>
        <input required value={piority} min={1} max={3} defaultValue={3} type="number" className="form-control" onChange={(e) => setPiority(e.target.value)} />
      </div>
    </div>
  }

  const prepareUpdatePoDetail = (poDetails_) => {
    if (poDetails_) {
      setcustomer(poDetails_.tbPurchaseOrder.customerId)
      setorderBy(poDetails_.orderBy)
      setcontactNumber(poDetails_.contactNumber)
      setpurchaseOrderDate(poDetails_.purchaseOrderDate ? moment(poDetails_.purchaseOrderDate).toDate() : null)
      setpurchaseOrderName(poDetails_.tbPurchaseOrder.purchaseOrderName)
      setrequestDate(poDetails_.requestDate ? moment(poDetails_.requestDate).toDate() : null)
      setcommitDate(poDetails_.commitDate ? moment(poDetails_.commitDate).toDate() : null)
      setinvoiceNumber(poDetails_.invoiceNumber)
      setinvoiceDate(poDetails_.invoiceDate ? moment(poDetails_.invoiceDate).toDate() : null)
      setquotationNumber(poDetails_.quotationNumber)
      setdrawing(poDetails_.drawing)
      setquantity(poDetails_.quantity)
      setunitPrice(poDetails_.unitPrice)
      setdescription(poDetails_.description)
      setComment(poDetails_.comment)
      setfinishedQuantity(poDetails_.finishedQuantity)
      setpurchaseOrderNumber(poDetails_.purchaseOrderNumber)
      setpurchaseOrderDetailName(poDetails_.purchaseOrderDetailName)
      setPiority(poDetails_.piority)
    }
  }

  const doReset = () => {
    setpurchaseOrderName('')
    setpurchaseOrderDate(null)
    setrequestDate(null)
    setcommitDate(null)
    setcontactNumber('')
    setcustomer('')
    setquotationNumber('')
    setdrawing('')
    setquantity('')
    setunitPrice('')
    setdescription('')
    setComment('')
    setorderBy('')
    setinvoiceNumber('')
    setinvoiceDate(null)
  }

  const doUpdatePo = () => {
    Swal.fire({
      title: 'โปรดยืนยัน?',
      text: "ต้องการแก้ไขรายละเอียดคำสั่งซื้อ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'แก้ไข'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setisLoad(true)
        let poNumber = purchaseOrderNumber;
        const { poDetailNumber } = params
        if (purchaseOrderName != poDetails.tbPurchaseOrder.purchaseOrderName || customer != poDetails.tbPurchaseOrder.customerId) {
          const po_ = await httpClient.get(apiName.purchaseOrder.poName + purchaseOrderName.replaceAll('/', '%2F'))

          if (!po_.data.result) {
            //if not create new po
            const result = await httpClient.post(apiName.purchaseOrder.po,
              {
                purchaseOrderName,
                createdBy: localStorage.getItem(key.user_id),
                customerId: customer,
              }
            )

            if (result.data.api_result == OK) {
              poNumber = result.data.result.purchaseOrderNumber
            } else {
              setisLoad(false)
              return
            }
          } else {
            poNumber = po_.data.result.purchaseOrderNumber
            console.log(purchaseOrderNumber);
            await httpClient.patch(apiName.purchaseOrder.po, {
              purchaseOrderNumber: poNumber,
              customerId: customer,
              updatedBy: localStorage.getItem(key.user_id)
            })

          }
        }

        console.log(poNumber);

        const response = await httpClient.patch(apiName.purchaseOrder.detail,
          {
            purchaseOrderDetailNumber: poDetailNumber,
            quotationNumber,
            drawing,
            description,
            comment,
            quantity,
            unitPrice,
            finishedQuantity,
            purchaseOrderDate: purchaseOrderDate ? moment(purchaseOrderDate).format('YYYY-MM-DD') : null,
            updatedBy: localStorage.getItem(key.user_id),
            requestDate: requestDate ? moment(requestDate).format('YYYY-MM-DD') : null,
            commitDate: moment(commitDate).format('YYYY-MM-DD'),
            contactNumber,
            invoiceNumber,
            orderBy,
            invoiceDate: invoiceDate ? moment(invoiceDate).format('YYYY-MM-DD') : null,
            purchaseOrderNumber: poNumber,
            piority,
          }
        )
        setisLoad(false)
        if (response.data.api_result == OK) {
          doGetPoDetail();
          Swal.fire(
            `สำเร็จ`,
            `แก้ไขรายละเอียดคำสั่งซื้อสำเร็จ`,
            'success'
          )
        } else {
          Swal.fire(
            `ล้มเหลว`,
            `แก้ไขรายละเอียดคำสั่งซื้อล้มเหลว`,
            'error'
          )
        }
      }
    })
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="อัพเดทคำสั่งซื้อ (Update Purchase Order)" />
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
                    
                    <button type="reset" onClick={() => doReset()} className="btn btn-default ">ยกเลิก</button>
                    <button type="submit" className="btn btn-warning float-right">ตกลง</button>
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
