import React, { useState, useEffect } from "react";
import ContentHeader from "../../main/ContentHeader/ContentHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../main/LoadingScreen";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function CreateNewPO() {

  const [isLoad, setisLoad] = useState(false)

  const [customers, setcustomers] = useState([])

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
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
  const [piority, setPiority] = useState(3)
  const [orderBy, setorderBy] = useState('')
  const [finishedQuantity, setfinishedQuantity] = useState(0)

  const navigate = useNavigate();

  useEffect(() => {
    doGetCustomer()


  }, [])

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
          ?????????????????????????????? (Customer)*</label>
        <select
          value={customer}
          onChange={async (e) => {
            setcustomer(e.target.value)
            // generatePoName(e.target.value, null);
          }}
          required
          className="form-control" >
          <option value="">---?????????????????????????????????---</option>
          {renderCustomerOption()}
        </select>
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
        <label >?????????????????????????????????/??????????????????????????????????????????</label>
        <input
          value={orderBy}
          onChange={(e) => setorderBy(e.target.value)}
          // required
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
        <label >??????????????????????????????????????????????????? (contactNumber)</label>
        <input
          value={contactNumber}
          onChange={(e) => setcontactNumber(e.target.value)}
          // required
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >????????????????????????????????????????????????????????? (Purchase Order date)</label>
        <DatePicker
          // required
          className="form-control" selected={purchaseOrderDate} onChange={(date) => {
            setpurchaseOrderDate(moment(date).startOf('D').toDate())
            // generatePoName(null, moment(date).startOf('D').toDate())
          }} />

      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
        <label >?????????????????????????????? (Purchase Order)*</label>
        <input
          required
          value={purchaseOrderName}
          onChange={(e) => setpurchaseOrderName(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >??????????????????????????????????????????????????????????????? (Request date)</label>
        <DatePicker 
        // required 
        className="form-control" selected={requestDate} onChange={(date) => setrequestDate(moment(date).startOf('D').toDate())} />

      </div>

      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >????????????????????????????????????????????? (Commit date)*</label>
        <DatePicker required className="form-control" selected={commitDate} onChange={(date) => setcommitDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
        <label >?????????????????????????????????????????? (Invoice Number)</label>
        <input
          value={invoiceNumber}
          onChange={(e) => setinvoiceNumber(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-4">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >??????????????????????????????????????????????????? (Invoice date)</label>
        <DatePicker className="form-control" selected={invoiceDate} onChange={(date) => setinvoiceDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-4">
        <label >???????????????????????????????????????????????? (Quotation Number)</label>
        <input value={quotationNumber} onChange={(e) => setquotationNumber(e.target.value)} 
        // required 
        className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >????????????????????? (Drawing)*</label>
        <input value={drawing} onChange={(e) => setdrawing(e.target.value)} required className="form-control" />
      </div>
      <div className="form-group col-sm-4"></div>
      <div className="form-group col-sm-4">
        <label >??????????????? (Quantity)*</label>
        <input value={quantity} onChange={(e) => setquantity(e.target.value)} required min={1} type="number" className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >???????????????????????????????????? (Unit price)*</label>
        <input value={unitPrice} onChange={(e) => setunitPrice(e.target.value)} required type="number" min={0} step={0.01} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >??????????????????????????????????????????????????? (Finished Quantity)</label>
        <input value={finishedQuantity} onChange={(e) => setfinishedQuantity(e.target.value)} required type="number" min={0} max={quantity} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >?????????????????????????????? (Description)</label>
        <textarea rows={3} value={description} onChange={(e) => setdescription(e.target.value)} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <label >????????????????????? (Comment)</label>
        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" />
      </div>
      <div className="form-group col-sm-4">
        <i className="fas fa-sort-numeric-up-alt" style={{ marginRight: 10 }} />
        <label >??????????????????????????? (Piority)*</label>
        <input required min={1} max={3} defaultValue={3} type="number" className="form-control" onChange={(e) => setPiority(e.target.value)}/>
      </div>
    </div>
  }

  const doGetCustomer = async () => {
    try {
      const response = await httpClient.get(apiName.master.customer + 'getAll')
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        setcustomers(response.data.result)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const doReset = () => {
    setpurchaseOrderName('')
    setpurchaseOrderDate(new Date())
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

  const doCreatePO = () => {
    try {
      Swal.fire({
        title: '??????????????????????????????',
        text: `?????????????????????????????????????????????????????????????????? ${purchaseOrderName}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '????????????',
        cancelButtonText: '??????????????????'
      }).then(async (confirm) => {
        if (confirm.isConfirmed) {
          setisLoad(true)
          //check have PO name ?
          const realPo =  purchaseOrderName == '-' ? 'tempPO_' + customer : purchaseOrderName
          const po_ = await httpClient.get(apiName.purchaseOrder.poName + realPo)
          let poNumber;
          if (!po_.data.result) {
            //if not create new po
            const result = await httpClient.post(apiName.purchaseOrder.po,
              {
                purchaseOrderName: realPo,
                createdBy: localStorage.getItem(key.user_id),
                customerId: customer,
              }
            )

            if (result.data.api_result == OK) {
              poNumber = result.data.result.purchaseOrderNumber
            } else {
              Swal.fire({
                icon: 'error',
                title: '?????????????????????',
                text: `????????????????????????????????????????????? ${realPo} ?????????????????????`
              })
              setisLoad(false)
              return
            }
          } else {
            poNumber = po_.data.result.purchaseOrderNumber
          }

          console.log(poNumber);

          if (poNumber) {
            const response = await httpClient.post(apiName.purchaseOrder.detail,
              {
                purchaseOrderNumber: poNumber,
                quotationNumber,
                drawing,
                quantity,
                unitPrice,
                invoiceNumber,
                invoiceDate,
                description,
                comment,
                purchaseOrderDate,
                requestDate,
                commitDate,
                contactNumber,
                createdBy: localStorage.getItem(key.user_id),
                orderBy,
                finishedQuantity,
                piority,
              }
            )

            Swal.fire({
              icon: 'success',
              title: '??????????????????',
              text: `????????????????????????????????????????????? ${purchaseOrderName} ??????????????????`
            })
            setisLoad(false)
            doReset()
          } else {
            Swal.fire({
              icon: 'error',
              title: '?????????????????????',
              text: `????????????????????????????????????????????? ${purchaseOrderName} ?????????????????????`
            })
          }
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="????????????????????????????????????????????? (Add New Purchase Order)" />
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
                    
                    <button type="reset" onClick={() => doReset()} className="btn btn-default ">??????????????????</button>
                    <button type="submit" className="btn btn-primary float-right">????????????</button>
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
