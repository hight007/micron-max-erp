import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import ContentHeader from "../../main/ContentHeader/ContentHeader";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../main/LoadingScreen";
import Modal from 'react-modal';
import MaterialReactTable from 'material-react-table';
import { NumericFormat } from 'react-number-format';
import _, { set } from 'lodash';

export default function UpdatePO(props) {
  const [isLoad, setisLoad] = useState(false)

  const [customers, setcustomers] = useState([])
  const [poDetails, setpoDetails] = useState([])

  const [modalIsOpen, setmodalIsOpen] = useState(false)
  const [modalStatus, setmodalStatus] = useState('add') // ["add" ,"edit"]

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [purchaseOrderDate, setpurchaseOrderDate] = useState(moment().startOf('D').toDate())
  const [requestDate, setrequestDate] = useState(null)
  const [commitDate, setcommitDate] = useState(null)
  const [contactNumber, setcontactNumber] = useState('')
  const [customer, setcustomer] = useState('')
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(null)

  //PO detail
  const [purchaseOrderDetailNumber, setpurchaseOrderDetailNumber] = useState('')
  const [quotationNumber, setquotationNumber] = useState('')
  const [drawing, setdrawing] = useState('')
  const [quantity, setquantity] = useState('')
  const [unitPrice, setunitPrice] = useState('')
  const [description, setdescription] = useState('')
  const [comment, setComment] = useState('')
  const [finishedQuantity, setfinishedQuantity] = useState('')

  const params = useParams();

  useEffect(() => {
    doGetPo()
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

  const doGetPo = async () => {
    try {
      setisLoad(true)
      await doGetCustomer()
      const response = await httpClient.get(apiName.purchaseOrder.po + params.poNumber)

      if (response.data.api_result === OK) {
        const result = response.data.result;

        setcustomer(result.customerId)
        setcontactNumber(result.contactNumber)
        setrequestDate(moment(result.requestDate).toDate())
        setpurchaseOrderName(result.purchaseOrderName)
        setpurchaseOrderDate(moment(result.purchaseOrderDate).toDate())
        setcommitDate(moment(result.commitDate).toDate())
        setinvoiceNumber(result.invoiceNumber)
        setinvoiceDate(result.invoiceDate == null ? null : moment(result.invoiceDate).toDate())
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
          const response = await httpClient.patch(apiName.purchaseOrder.po,
            {
              purchaseOrderNumber: params.poNumber,
              purchaseOrderName,
              purchaseOrderDate,
              requestDate,
              commitDate,
              contactNumber,
              invoiceNumber: invoiceNumber ? invoiceNumber == "" ? null : invoiceNumber : invoiceNumber,
              invoiceDate,
              updatedBy: localStorage.getItem(key.user_id),
              customerId: customer
            }
          )
          setisLoad(false)
          if (response.data.api_result == OK) {
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
          onChange={(e) => {
            setcustomer(e.target.value)
            // generatePoName(e.target.value, null);
          }
          }
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
        <DatePicker required className="form-control" selected={purchaseOrderDate} onChange={(date) => {
          setpurchaseOrderDate(moment(date).startOf('D').toDate())
          // generatePoName(null, moment(date).startOf('D').toDate())
        }} />

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
      <div className="form-group col-sm-6">
        <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
        <label >เลขที่ใบส่งของ (Invoice Number)</label>
        <input
          value={invoiceNumber}
          onChange={(e) => setinvoiceNumber(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group col-sm-6">
        <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
        <label >วันที่ออกใบส่งของ (Invoice date)</label>
        <DatePicker className="form-control" selected={invoiceDate} onChange={(date) => setinvoiceDate(moment(date).startOf('D').toDate())} />

      </div>
    </div>
  }

  //PO Detail

  const doGetPoDetail = async () => {
    try {
      const { poNumber } = params
      setisLoad(true)
      const response = await httpClient.get(apiName.purchaseOrder.detail + 'po=' + poNumber)
      if (response.data.api_result === OK) {
        setpoDetails(response.data.result)
      }

    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  const closeModal = () => {
    setquotationNumber('')
    setdrawing('')
    setquantity('')
    setunitPrice('')
    setdescription('')
    setComment('')
    setfinishedQuantity('')
    setpurchaseOrderDetailNumber('')
    setmodalIsOpen(false)
    doGetPoDetail()
    setmodalStatus('add')
  }

  const openModal = () => {
    setmodalIsOpen(true)
  }

  const renderModalInputPoDetails = () => {
    return <Modal
      isOpen={modalIsOpen}
      style={{
        content: {
          transform: 'translate(0%, 0%)',
          overlfow: 'scroll' // <-- This tells the modal to scrol
        },
      }}
      className="content-wrapper resizeable"
    >
      <div className="row" style={{ margin: '5%', marginTop: '15%', padding: '0%', backgroundColor: 'rgba(0,0,0,0)', overflow: 'auto' }}>
        <div className="col-sm-12" >

          <div className={`card card-${modalStatus == 'add' ? 'primary' : 'warning'}`}>
            <div className="card-header">
              <h3 class="card-title">{`${modalStatus == 'add' ? 'เพิ่ม' : 'แก้ไข'}รายการคำสั่งซื้อ`}</h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool" onClick={(e) => {
                  closeModal();
                }}><i className="fas fa-times" />

                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              modalStatus == 'add' ? doAddPoDetail() : doUpdatePoDetail()
            }}>
              <div className="card-body row">

                <div className="form-group col-sm-6">
                  <label >เลขที่ใบเสนอราคา (Quotation Number)</label>
                  <input value={quotationNumber} onChange={(e) => setquotationNumber(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group col-sm-6">
                  <label >แบบแปลน (Drawing)</label>
                  <input value={drawing} onChange={(e) => setdrawing(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group col-sm-6">
                  <label >จำนวน (Quantity)</label>
                  <input value={quantity} onChange={(e) => setquantity(e.target.value)} required min={1} type="number" className="form-control" />
                </div>
                <div className="form-group col-sm-6">
                  <label >ราคาต่อหน่วย (Unit price)</label>
                  <input value={unitPrice} onChange={(e) => setunitPrice(e.target.value)} required type="number" min={0} step={0.01} className="form-control" />
                </div>
                {
                  modalStatus == 'add' ?
                    <></> :
                    <div className="form-group col-sm-12">
                      <label >จำนวนที่เสร็จสิ้น (Finished Quantity)</label>
                      <input value={finishedQuantity} onChange={(e) => setfinishedQuantity(e.target.value)} required min={0} max={quantity} step={1} type="number" className="form-control" />
                    </div>
                }
                <div className="form-group col-sm-6">
                  <label >รายละเอียด (Description)</label>
                  <textarea rows={3} value={description} onChange={(e) => setdescription(e.target.value)} className="form-control" />
                </div>
                <div className="form-group col-sm-6">
                  <label >คอมเม้น (Comment)</label>
                  <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" />
                </div>

              </div>
              <div className="card-footer">
                <button type="submit" className={`btn btn-${modalStatus == 'add' ? 'primary' : 'warning'}`}>{modalStatus == 'add' ? 'ตกลง' : 'แก้ไข'}</button>
                <button type="reset" onClick={() => closeModal()} className="btn btn-default float-right">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  }

  const renderPoDetail = () => {
    if (poDetails.length > 0) {
      const columns = [
        {
          header: '',
          accessorKey: 'purchaseOrderDetailNumber', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => (
            <div>
              <button className="btn btn-default" style={{ marginRight: 10 }} onClick={() => {
                prepareUpdatePoDetail(cell.getValue())
              }} >
                <i className="fas fa-edit" />
              </button>
              <button className="btn btn-default" onClick={() => {
                deDeletePoDetail(cell.getValue())
              }}>
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          )
        },
        {
          header: 'เลขที่รายละเอียดคำสั่งซื้อ',
          accessorKey: 'purchaseOrderDetailNumber', //simple accessorKey pointing to flat data
        },

        {
          header: 'เลขที่ใบเสนอราคา',
          accessorKey: 'quotationNumber', //simple accessorKey pointing to flat data
        },
        {
          header: 'แบบแปลน',
          accessorKey: 'drawing', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนทั้งหมด',
          accessorKey: 'quantity', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />

        },
        {
          header: 'สถานะ',
          accessorKey: 'quantity', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => cell.getValue() > row.original.finishedQuantity ?
            <button className="btn btn-warning btn-xs">ดำเนินการ</button> :
            <button className="btn btn-success btn-xs">เสร็จสิ้น</button>

        },
        {
          header: 'จำนวนที่เสร็จสิ้น',
          accessorKey: 'finishedQuantity', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />

        },

        {
          header: 'ราคาต่อหน่วย',
          accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" suffix={'฿'} />
        },
        {
          header: 'ราคารวม',
          accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <NumericFormat thousandSeparator="," value={cell.getValue() * row.original.quantity} displayType="text" suffix={'฿'} />
        },
        {
          header: 'ราบละเอียด',
          accessorKey: 'description', //simple accessorKey pointing to flat data
        },
        {
          header: 'คอมเม้น',
          accessorKey: 'comment', //simple accessorKey pointing to flat data
        },
        {
          header: 'เพิ่มเมื่อ (Created At)',
          accessorKey: 'createdAt', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
        },
        {
          header: 'เพิ่มโดย (Created By)',
          accessorKey: 'createdByName', //simple accessorKey pointing to flat data
        },
        {
          header: 'แก้ไขเมื่อ (Updated At)',
          accessorKey: 'updatedAt', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
        },
        {
          header: 'แก้ไขโดย (Updated By)',
          accessorKey: 'updatedByName', //simple accessorKey pointing to flat data
        },
      ]
      return <MaterialReactTable
        columns={columns}
        data={poDetails}
        enableColumnOrdering
      />
    }
  }

  const doAddPoDetail = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มรายการคำสั่งซื้อ?`,
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
          const response = await httpClient.post(apiName.purchaseOrder.detail,
            {
              purchaseOrderNumber: params.poNumber,
              quotationNumber,
              drawing,
              quantity,
              unitPrice,
              description,
              comment,
              createdBy: localStorage.getItem(key.user_id),
            }
          )
          setisLoad(false)
          if (response.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มรายการคำสั่งซื้อสำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มรายการคำสั่งซื้อล้มเหลว`
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

  const deDeletePoDetail = (purchaseOrderDetailNumber_) => {
    Swal.fire({
      title: 'โปรดยืนยัน?',
      text: "ต้องการลบรายละเอียดคำสั่งซื้อเลขที่ " + purchaseOrderDetailNumber_,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ลบเลย'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setisLoad(true)
        const response = await httpClient.patch(apiName.purchaseOrder.detail,
          {
            purchaseOrderDetailNumber: purchaseOrderDetailNumber_,
            isDeleted: true
          }
        )
        setisLoad(false)
        if (response.data.api_result == OK) {
          Swal.fire(
            `สำเร็จ`,
            `ลบรายละเอียดคำสั่งซื้อเลขที่ ${purchaseOrderDetailNumber_} สำเร็จ`,
            'success'
          ).then(() => doGetPoDetail())
        } else {
          Swal.fire(
            `ล้มเหลว`,
            `ลบรายละเอียดคำสั่งซื้อเลขที่ ${purchaseOrderDetailNumber_} ล้มเหลว`,
            'error'
          )
        }



      }
    })
  }

  const prepareUpdatePoDetail = (purchaseOrderDetailNumber_) => {
    setmodalStatus('edit')
    openModal()
    const poDetail = _.filter(poDetails, { purchaseOrderDetailNumber: purchaseOrderDetailNumber_ })
    setpurchaseOrderDetailNumber(purchaseOrderDetailNumber_)
    setdescription(poDetail[0].description)
    setquotationNumber(poDetail[0].quotationNumber)
    setdrawing(poDetail[0].drawing)
    setquantity(poDetail[0].quantity)
    setunitPrice(poDetail[0].unitPrice)
    setComment(poDetail[0].comment)
    setfinishedQuantity(poDetail[0].finishedQuantity)
  }

  const doUpdatePoDetail = () => {
    Swal.fire({
      title: 'โปรดยืนยัน?',
      text: "ต้องการแก้ไขรายละเอียดคำสั่งซื้อ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ลบเลย'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setisLoad(true)
        const response = await httpClient.patch(apiName.purchaseOrder.detail,
          {
            purchaseOrderDetailNumber,
            quotationNumber,
            drawing,
            description,
            comment,
            quantity,
            unitPrice,
            finishedQuantity,
            updatedBy: localStorage.getItem(key.user_id),
          }
        )
        setisLoad(false)
        if (response.data.api_result == OK) {
          Swal.fire(
            `สำเร็จ`,
            `แก้ไขรายละเอียดคำสั่งซื้อสำเร็จ`,
            'success'
          ).then(() => closeModal())
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

  const generatePoName = async (customer_, purchaseOrderDate_) => {
    const _purchaseOrderDate = purchaseOrderDate_ ? purchaseOrderDate_ : purchaseOrderDate
    const _customer = customer_ ? customer_ : customer
    let autoGeneratePoName = ''
    if (_purchaseOrderDate != null && _customer != null && _customer != '') {
      setisLoad(true)
      const response = await httpClient.post(apiName.purchaseOrder.generatePoNumber, { _purchaseOrderDate, _customer })
      setisLoad(false)
      if (response.data.api_result == OK) {
        autoGeneratePoName = `${("000" + _customer).slice(-4)}_${moment(_purchaseOrderDate).format('MMYYYY')}_${("000" + response.data.result).slice(-4)}`
        setpurchaseOrderName(autoGeneratePoName)
      }
    }
  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="แก้ไขคำสั่งซื้อ (Update Purchase Order)" />
      <section className="content">
        <LoadingScreen isLoad={isLoad} />
        <div className="container-fluid">
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
                    <button type="submit" className="btn btn-warning">แก้ไข</button>
                    <button type="reset" onClick={() => closeModal()} className="btn btn-default float-right">ยกเลิก</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header text-center">
                  <button className="btn btn-primary " onClick={() => { openModal() }}>
                    <i className="fas fa-cart-plus" style={{ marginRight: 10 }} />
                    เพิ่มรายการคำสั่งซื้อ
                  </button>
                </div>
                <div className="card-body ">
                  {renderModalInputPoDetails()}
                  {renderPoDetail()}
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
