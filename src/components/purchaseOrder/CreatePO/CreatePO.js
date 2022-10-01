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

export default function CreatePO() {
  const [isLoad, setisLoad] = useState(false)

  const [customers, setcustomers] = useState([])

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [purchaseOrderDate, setpurchaseOrderDate] = useState(moment().startOf('D').toDate())
  const [requestDate, setrequestDate] = useState(null)
  const [commitDate, setcommitDate] = useState(null)
  const [contactNumber, setcontactNumber] = useState('')
  const [customer, setcustomer] = useState('')

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
      <div className="form-group col-sm-6">
        <i className="fas fa-external-link-alt" style={{ marginRight: 10 }} />
        <label >เบอร์ติดต่อลูกค้า (contactNumber)</label>
        <input
          value={contactNumber}
          onChange={(e) => setcontactNumber(e.target.value)}
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
        <label >วันที่ส่งในใบสั่งซื้อ (Request date)</label>
        <DatePicker required className="form-control" selected={requestDate} onChange={(date) => setrequestDate(moment(date).startOf('D').toDate())} />

      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่นัดส่งงาน (Commit date)</label>
        <DatePicker required className="form-control" selected={commitDate} onChange={(date) => setcommitDate(moment(date).startOf('D').toDate())} />

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
              contactNumber,
              createdBy: localStorage.getItem(key.user_id),
              customerId: customer,
            }
          )
          setisLoad(false)
          if (result.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มคำสั่งซื้อ ${purchaseOrderName} สำเร็จ กรุณาเพิ่มรายละเอียดคำสั่งซื้อ`
            }).then(() => navigate('/PurchaseOrder/UpdatePO/' + result.data.result.purchaseOrderNumber));
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
