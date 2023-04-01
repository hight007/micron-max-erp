import React, { useState, useEffect } from "react";
import ContentHeader from '../../main/ContentHeader/ContentHeader';
import LoadingScreen from '../../main/LoadingScreen';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiName, key, OK } from "../../../constants";
import Swal from "sweetalert2";
import moment from "moment";
import { httpClient } from "../../../utils/HttpClient";
import MaterialReactTable from 'material-react-table';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { CSVLink, CSVDownload } from "react-csv";
import { Box, Button } from '@mui/material';
import _ from "lodash";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";

export default function ReportPO() {
  const [isLoad, setisLoad] = useState(false)
  const [users, setusers] = useState([])

  const [dateFrom, setdateFrom] = useState(moment().add(-1, 'd').toDate())
  const [dateTo, setdateTo] = useState(moment().endOf('d').toDate())
  const [dateType, setdateType] = useState('')


  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [customer, setcustomer] = useState('')
  const [drawing, setdrawing] = useState('')
  const [quotationNumber, setquotationNumber] = useState('')
  const [createdBy, setcreatedBy] = useState('')
  const [description, setdescription] = useState('')
  const [status, setstatus] = useState('Inprocess')

  const [purchaseData, setpurchaseData] = useState([])
  const [customers, setcustomers] = useState([])

  const [muiTableKey, setMuiTableKey] = useState(0);

  useEffect(() => {
    doGetCustomer()
    getUsers()
    doGetPurchaseOrder()
  }, [])

  const headers = [
    { label: "No.", key: "purchaseOrderDetailName" },
    { label: "DATE", key: "purchaseOrderDate" },
    { label: "PO#", key: "purchaseOrderName" },
    { label: "DRAWING#", key: "drawing" },
    { label: "DESCRIPTION", key: "description" },
    { label: "QTY", key: "quantity" },
    { label: "Commited Date", key: "commitDate" },
    { label: "MICRON#", key: "quotationNumber" },
    { label: "NAME", key: "createdBy" },
    { label: "Ext", key: "contactNumber" },
    { label: "PO-DATE", key: "requestDate" },
    { label: "Inv. DATE", key: "invoiceDate" },
    { label: "Inv. Number", key: "invoiceNumber" },
    { label: "Unit Price", key: ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? "unitPrice" : "" },
    { label: "Total", key: ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? "total" : "" },
    { label: "REMARKS", key: "comment" },

    { label: "STATUS", key: "status" },
    { label: "ชื่อผู้สั่ง/ชื่อเจ้าของงาน", key: "orderBy" },
    { label: "Customer", key: "customerName" },
    { label: "Piority", key: "piority" }
  ];

  const getUsers = async () => {
    try {
      const response = await httpClient.get(apiName.user.allUsers)
      if (response.data.api_result === OK) {
        setusers(response.data.result)
      }

    } catch (error) {
      console.log(error);
    }
  }

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

  const doReset = () => {
    setdateFrom(moment().add(-1, 'M').toDate())
    setdateTo(moment().startOf('D').toDate())
    setdateType('')
    setpurchaseOrderName('')
    setinvoiceNumber('')
  }

  const doGetPurchaseOrder = async () => {
    try {
      setisLoad(true)
      setMuiTableKey(muiTableKey + 1)
      let condition = {}
      if (dateType != '') {
        condition[dateType] = { dateFrom: moment(dateFrom).startOf('day').toDate(), dateTo: moment(dateTo).endOf('day').toDate() }
      } else {
        if (purchaseOrderName == '' && invoiceNumber == '' && customer == '') {
          condition.createdAt = { dateFrom: moment(dateFrom).startOf('day').toDate(), dateTo: moment(dateTo).endOf('day').toDate() }
        }
      }

      if (purchaseOrderName != '' && purchaseOrderName != null) {
        condition.purchaseOrderName = purchaseOrderName
      }
      if (invoiceNumber != '' && invoiceNumber != null) {
        condition.invoiceNumber = invoiceNumber
      }
      if (customer != '' && customer != null) {
        condition.customer = customer
      }
      if (drawing != '' && drawing != null) {
        condition.drawing = drawing
      }
      if (quotationNumber != '' && quotationNumber != null) {
        condition.quotationNumber = quotationNumber
      }
      if (createdBy != '' && createdBy != null) {
        condition.createdBy = createdBy
      }
      if (description != '' && description != null) {
        condition.description = description
      }
      if (status != '' && status != null){
        condition.status = status
      }

      const response = await httpClient.post(apiName.purchaseOrder.get, { condition })
      if (response.data.api_result === OK) {
        await  setpurchaseData(response.data.result)
        // const dropDownValue = document.getElementsByClassName("css-yf8vq0-MuiSelect-nativeInput")[0].value;
        // if (dropDownValue == 10){

        // }
        // document.querySelector("form[name='foo'] > input.bar").value = "blah"
      }

    } catch (error) {
      console.log(error);
    }
    finally {
      setisLoad(false)
    }
  }

  const renderSearchCondition = () => {
    const renderCustomerOption = () => {
      if (customers.length > 0) {
        return customers.map((item , index) => (
          <option key={index} value={item.customerId}>{item.customerName}</option>
        ))
      }
    }

    return (
      <>

        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header">
              <div className="card-title">
                ค้นหาตามชื่อ (Search by name)
              </div>
            </div>
            <div className="card-body row">
              <div className="form-group col-sm-4 resizeable">
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
              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
                <label >ใบสั่งซื้อ (Purchase Order)</label>
                <input
                  value={purchaseOrderName}
                  onChange={(e) => setpurchaseOrderName(e.target.value)}
                  className="form-control"
                />
              </ div>

              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-pencil-ruler" style={{ marginRight: 10 }} />
                <label >แบบแปลน (Drawing)</label>
                <input
                  value={drawing}
                  onChange={(e) => setdrawing(e.target.value)}
                  className="form-control"
                />
              </ div>

              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-user" style={{ marginRight: 10 }} />
                <label >ชื่อผู้สั่งซื้อ (Created by)</label>
                <input
                  value={createdBy}
                  onChange={(e) => setcreatedBy(e.target.value)}
                  className="form-control"
                />
              </ div>

              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-file-signature" style={{ marginRight: 10 }} />
                <label >เลขที่ใบเสนอราคา (Quotation Number)</label>
                <input
                  value={quotationNumber}
                  onChange={(e) => setquotationNumber(e.target.value)}
                  className="form-control"
                />
              </ div>

              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
                <label >
                  เลขที่ใบส่งของ (Invoice Number)</label>
                <input
                  value={invoiceNumber}
                  onChange={(e) => setinvoiceNumber(e.target.value)}
                  required
                  className="form-control" />
              </div>

              <div className="form-group col-md-4 resizeable">
                <i className="fas fa-file" style={{ marginRight: 10 }} />
                <label >
                  สถานะ (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                  required
                  className="form-control" >
                  <option value="">ทั้งหมด</option>
                  <option value="Inprocess">ดำเนินการ</option>
                  <option value="Done">เสร็จสิ้น</option>
                </select>
              </div>

              <div className="form-group col-md-8 resizeable">
                <i className="fas fa-file" style={{ marginRight: 10 }} />
                <label >รายละเอียด (Description)</label>
                <input
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  className="form-control"
                />
              </ div>

            </div>
          </div>
        </div>
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
                  onChange={(date) => setdateFrom(moment(date).startOf('D').toDate())}
                />

              </div>
              <div className="form-group col-md-4 resizeable">
                <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
                <label >วันที่สิ้นสุด (Date to)</label>
                <DatePicker
                  className="form-control"
                  selected={dateTo}
                  onChange={(date) => setdateTo(moment(date).endOf('D').toDate())}
                />

              </div>

            </div>
          </div>

        </div>
      </>
    )
  }

  const getColor = (piority) => {
    switch (piority) {
      case 1: return '#ff7c80'

      case 2: return '#fde499'

      default: return '#b5f0b3'

    }
  }

  const renderSearchResult = () => {
    const columns = [
      {
        header: 'แก้ไข/ลบ',
        accessorKey: 'purchaseOrderDetailNumber', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => (
          <div>
            <Link style={{ marginRight: 10 }} className="btn btn-default" to={`/PurchaseOrder/UpdatePO/${cell.getValue()}`} target="_blank"  >
              <i className="fas fa-edit" />
            </Link>
            <button style={{ marginRight: 10 }} className="btn btn-default" onClick={() => {
              doDeletePoDetail(row.original.purchaseOrderDetailNumber, row.original.purchaseOrderDetailName)
            }} >
              <i className="fas fa-trash" />
            </button>
          </div>
        ),

      },

      {
        header: 'DATE',
        accessorKey: 'purchaseOrderDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == null || cell.getValue() == '' ? '' : moment(cell.getValue()).format("DD-MMM-YY")
      },
      {
        header: 'No.',
        accessorKey: 'runningnumber', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => row.original.purchaseOrderDetailName
      },
      {
        header: 'PO#',
        accessorKey: 'purchaseOrderName', //simple accessorKey pointing to flat data
      },

      {
        header: 'DRAWING#',
        accessorKey: 'drawing', //simple accessorKey pointing to flat data
      },
      {
        header: 'DESCRIPTION',
        accessorKey: 'description', //simple accessorKey pointing to flat data
      },
      {
        header: 'QTY',
        accessorKey: 'quantity', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <NumericFormat thousandSeparator="," value={row.original.finishedQuantity} displayType="text" />/<NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />
        </>
      },
      {
        header: 'Commited Date',
        accessorKey: 'commitDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <div style={{ backgroundColor: getColor(row.original.piority) , textAlign: 'center' , borderRadius : 10}}>{cell.getValue() == null || cell.getValue() == '' || cell.getValue() == 'Invalid date' ? '' : moment(cell.getValue()).format("DD-MMM-YY")}</div>
      },
      {
        header: 'MICRON#',
        accessorKey: 'quotationNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'ชื่อผู้สั่ง/ชื่อเจ้าของงาน',
        accessorKey: 'orderBy', //simple accessorKey pointing to flat data
      },

      {
        header: 'NAME',
        accessorKey: 'createdBy', //simple accessorKey pointing to flat data
      },
      {
        header: 'Ext',
        accessorKey: 'contactNumber', //simple accessorKey pointing to flat data
      },
      
      {
        header: 'PO-DATE',
        accessorKey: 'requestDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == null || cell.getValue() == '' || cell.getValue() == 'Invalid date' ? '' : moment(cell.getValue()).format("DD-MMM-YY")
      },
      {
        header: 'STATUS',
        accessorKey: 'statusEn', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == 'Inprocess' ?
          <button className="btn btn-warning btn-xs">ดำเนินการ</button> :
          <button className="btn btn-success btn-xs">เสร็จสิ้น</button>
      },
      {
        header: 'Inv. DATE',
        accessorKey: 'invoiceDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == null || cell.getValue() == '' ? '' : moment(cell.getValue()).format("DD-MMM-YY")
      },
      {
        header: 'Inv. Number',
        accessorKey: 'invoiceNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'Unit Price',
        accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" /> : <></>
      },
      {
        header: 'Total',
        accessorKey: 'total', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" /> : <></>
      },
      {
        header: 'REMARKS',
        accessorKey: 'comment', //simple accessorKey pointing to flat data
      },
      {
        header: 'Customer',
        accessorKey: 'customerName', //simple accessorKey pointing to flat data
      },
      {
        header: 'Piority',
        accessorKey: 'piority'
      }
    ]

    const handleExportData = (rows) => {
      let data = rows.map((row) => row.original)
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        item.purchaseOrderDate = item.purchaseOrderDate ? moment(item.purchaseOrderDate).format('YYYY-MM-DD') : ''
        item.commitDate = moment(item.commitDate).format('YYYY-MM-DD')
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.invoiceDate = item.invoiceDate == "" ? "" : moment(item.invoiceDate).format('YYYY-MM-DD')
        item.requestDate = item.requestDate == "" ? "" : moment(item.requestDate).format('YYYY-MM-DD')
        item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        // item.total = item.quantity * item.unitPrice
        item.status = item.quantity > item.finishedQuantity ? "ดำเนินการ" : "เสร็จสิ้น"
      }
      // console.log(data);

      return data;
    };

    const handlePrint = (data) => {
      const _data = _.map(data, 'original');
      const _data_ = _.map(_data, 'purchaseOrderDetailNumber');
      window.open('/JobOrder/JobCards/' + JSON.stringify(_data_), '_blank');
    }

    const handleJobTracking = (data) => {
      const _data = _.map(data, 'original');
      const _data_ = _.map(_data, 'purchaseOrderDetailNumber');
      window.open('/JobOrder/JobTrackingCards/' + JSON.stringify(_data_), '_blank');
    }

    if (purchaseData.length > 0) {
      return <>
        <div className="col-md-12">
          <MaterialReactTable
            key={muiTableKey}
            enableColumnResizing
            columnResizeMode="onChange"
            columns={columns}
            data={purchaseData}
            enableColumnOrdering
            enableRowSelection
            enableStickyHeader
            enableStickyFooter
            enablePagination={true}
            initialState={{ pagination: { pageSize: 100, } }}

            muiTableContainerProps={{
              // sx: { maxHeight: 600 }, 
            }}
            muiTablePaginationProps={{
              rowsPerPageOptions: [10 , 50, 100 , 150 , 200 ,250 ,300],
            }}
            positionToolbarAlertBanner="bottom"
            renderTopToolbarCustomActions={({ table }) => {
              let selectdItem = _.map(table.getSelectedRowModel().rows, 'original')
              return (
                <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                  <CSVLink className="btn btn-primary"
                    data={handleExportData(table.getRowModel().rows)}
                    filename={`Report_Purchase_Order_${moment().format('DD-MMM-YY')}.csv`}
                    headers={headers}
                  >
                    <i className="fas fa-file-csv" style={{ marginRight: 10 }} />ส่งออกข้อมูลเป็น CSV
                  </CSVLink>
                  <button
                    disabled={
                      // (!table.getIsSomeRowsSelected() || selectdItem.length > 7) && (!table.getIsAllRowsSelected())
                      selectdItem.length < 10 && selectdItem.length > 0 ? false : true
                    }
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePrint(table.getSelectedRowModel().rows)
                    }}
                  >
                    <i className="fas fa-print" style={{ marginRight: 10 }} />
                    พิมพ์ใบคำสั่งงาน
                  </button>
                  <button
                    disabled={
                      !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      handleJobTracking(table.getSelectedRowModel().rows)
                    }}
                  >
                    <i className="fas fa-file-contract" style={{ marginRight: 10 }} />
                    พิมพ์ใบตามงาน
                  </button>
                </Box>
              )
            }}
          />
        </div>
      </>
    }
  }



  const doDeletePoDetail = (purchaseOrderDetailNumber, purchaseOrderDetailName_) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการลบคำสั่งซื้อ ${purchaseOrderDetailName_}`,
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
          const result = await httpClient.delete(apiName.purchaseOrder.detail,
            {
              data: { purchaseOrderDetailNumber }
            }
          )
          setisLoad(false)
          if (result.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ลบคำสั่งซื้อ ${purchaseOrderDetailName_} สำเร็จ`
            }).then(() => doGetPurchaseOrder());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ลบสั่งซื้อ ${purchaseOrderDetailName_} ล้มเหลว`
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

  const findUser = (user) => {
    if (user != null && users.length > 0) {
      const createdUser = _.find(users, { user_id: user })
      return createdUser.username
    } else {
      return ''
    }
  }

  return (
    <div className="content-wrapper "><ContentHeader header="รายงานคำสั่งซื้อ (Report Purchase Order)" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
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
