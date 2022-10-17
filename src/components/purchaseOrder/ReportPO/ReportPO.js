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
import { Box, Button } from '@mui/material';
import _ from "lodash";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";

export default function ReportPO() {
  const [isLoad, setisLoad] = useState(false)
  const [users, setusers] = useState([])

  const [dateFrom, setdateFrom] = useState(moment().add(-1, 'M').toDate())
  const [dateTo, setdateTo] = useState(moment().endOf('D').toDate())
  const [dateType, setdateType] = useState('')

  const [purchaseOrderName, setpurchaseOrderName] = useState('')
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [customer, setcustomer] = useState('')

  const [purchaseData, setpurchaseData] = useState([])
  const [customers, setcustomers] = useState([])

  useEffect(() => {
    doGetCustomer()
    getUsers()
    doGetPurchaseOrder()
  }, [])

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

      const response = await httpClient.post(apiName.purchaseOrder.get, { condition })

      console.log(response.data);
      if (response.data.api_result === OK) {
        setpurchaseData(response.data.result)
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
        return customers.map((item) => (
          <option value={item.customerId}>{item.customerName}</option>
        ))
      }
    }

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
                <i className="fas fa-file-invoice-dollar" style={{ marginRight: 10 }} />
                <label >
                  เลขที่ใบส่งของ (Invoice Number)</label>
                <input
                  value={invoiceNumber}
                  onChange={(e) => setinvoiceNumber(e.target.value)}
                  required
                  className="form-control" />
              </div>
              <div className="form-group col-sm-12">
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
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderSearchResult = () => {
    const columns = [
      {
        header: 'แก้ไข/ลบ',
        accessorKey: 'purchaseOrderNumber', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => (
          <div>
            <Link style={{ marginRight: 10 }} className="btn btn-default" to={`/PurchaseOrder/UpdatePO/${cell.getValue()}`} target="_blank"  >
              <i className="fas fa-edit" />
            </Link>
            {/* <button className="btn btn-default" onClick={() => {
              doDeletePo(cell.getValue(), row.original.purchaseOrderName)
            }}>
              <i className="fas fa-trash-alt" />
            </button> */}
          </div>
        )
      },
      {
        header: 'ใบสั่งซื้อ (Purchase Order)',
        accessorKey: 'purchaseOrderName', //simple accessorKey pointing to flat data
      },

      {
        header: 'ชื่อลูกค้า (Customer name)',
        accessorKey: 'customerName', //simple accessorKey pointing to flat data
      },
      {
        header: 'เลขที่รายละเอียดคำสั่งซื้อ',
        accessorKey: 'purchaseOrderDetailName', //simple accessorKey pointing to flat data
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
        header: 'เลขที่ใบเสนอราคา',
        accessorKey: 'quotationNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'แบบแปลน',
        accessorKey: 'drawing', //simple accessorKey pointing to flat data
      },
      {
        header: 'วันที่ออกใบสั่งซื้อ (Purchase Order date)',
        accessorKey: 'purchaseOrderDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy")
      },
      {
        header: 'วันที่ขอใบสั่งซื้อ (Request date)',
        accessorKey: 'requestDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy")
      },
      {
        header: 'วันที่นัดส่งงาน (Commit date)',
        accessorKey: 'commitDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy")
      },
      {
        header: 'เลขที่ใบส่งของ (Invoice Number)',
        accessorKey: 'invoiceNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'วันที่ออกใบส่งของ (Invoice date)',
        accessorKey: 'invoiceDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == null ? '' : moment(cell.getValue()).format("DD-MMM-yyyy")
      },
      {
        header: 'เพิ่มเมื่อ (Created At)',
        accessorKey: 'createdAt', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
      },
      {
        header: 'เพิ่มโดย (Created By)',
        accessorKey: 'createdBy', //simple accessorKey pointing to flat data
        // Cell: ({ cell, row }) => findUser(cell.getValue()),
      },
      {
        header: 'แก้ไขเมื่อ (Updated At)',
        accessorKey: 'updatedAt', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
      },
      {
        header: 'แก้ไขโดย (Updated By)',
        accessorKey: 'updatedBy', //simple accessorKey pointing to flat data
        // Cell: ({ cell, row }) => findUser(cell.getValue()),
      },


    ]

    const handleExportData = () => {
      const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: columns.map((c) => c.header),
        filename: `Report_Purchase_Order_${moment().format('YYYY-MM-DD')}`,
      };

      const csvExporter = new ExportToCsv(csvOptions);
      csvExporter.generateCsv(purchaseData);
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
            columns={columns}
            data={purchaseData}
            enableColumnOrdering
            enableRowSelection
            enableStickyHeader
            enableStickyFooter
            muiTableContainerProps={{ sx: { maxHeight: 500 } }}
            positionToolbarAlertBanner="bottom"
            renderTopToolbarCustomActions={({ table }) => (
              <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    handleExportData()
                  }}
                >
                  <i className="fas fa-file-csv" style={{ marginRight: 10 }} />
                  ส่งออกข้อมูลเป็น CSV
                </button>
                <button
                  disabled={
                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
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
            )}
            // renderDetailPanel={({ row }) => (
            //   <Box>
            //     {renderPurchaseOrderDetailsTable(row.original.tbPurchaseOrderDetails)}
            //   </Box>
            // )}
          />
        </div>
      </>
    }
  }

  const renderPurchaseOrderDetailsTable = (data) => {

    data = _.filter(data, { isDeleted: false })
    const header = () => {
      return (
        <tr>
          <th>purchaseOrderDetailName</th>
          <th>quantity</th>
          <th>finishedQuantity</th>
          <th>status</th>
          <th>drawing</th>
          <th>quotationNumber</th>
          <th>description</th>
          <th>comment</th>
          <th>createdAt</th>
          <th>createdBy</th>
          <th>updatedAt</th>
          <th>updatedBy</th>

        </tr>
      )
    }
    const body = (data) => {
      return data.map((item, index) => (
        <tr>
          <td>{item.purchaseOrderDetailName}</td>
          <td>{<NumericFormat thousandSeparator="," value={item.quantity} displayType="text" />}</td>
          <td>{<NumericFormat thousandSeparator="," value={item.finishedQuantity} displayType="text" />}</td>
          <td>{item.quantity > item.finishedQuantity ?
            <button className="btn btn-warning btn-xs">ดำเนินการ</button> :
            <button className="btn btn-success btn-xs">เสร็จสิ้น</button>}
          </td>
          <td>{item.drawing}</td>
          <td>{item.quotationNumber}</td>
          <td>{item.description}</td>
          <td>{item.comment}</td>
          <td>{moment(item.createdAt).format('DD-MMM-YY HH:mm:ss')}</td>
          <td>{findUser(item.createdBy) }</td>
          <td>{moment(item.updatedAt).format('DD-MMM-YY HH:mm:ss')}</td>
          <td>{findUser(item.updatedBy) }</td>
        </tr>
      ))
    }
    if (data.length > 0) {
      
      console.log(data);
      return (
        <table className="table text-nowrap" style={{ backgroundColor: '#F0F0F0', width: '60%' }}>
          <thead>
            {header()}
          </thead>
          <tbody>
            {body(data)}
          </tbody>
        </table>
      )
    }


  }

  const doDeletePo = (purchaseOrderNumber, purchaseOrderName_) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการลบคำสั่งซื้อ ${purchaseOrderName_}`,
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
          const result = await httpClient.delete(apiName.purchaseOrder.po,
            {
              data: { purchaseOrderNumber }
            }
          )
          setisLoad(false)
          if (result.data.api_result == OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ลบคำสั่งซื้อ ${purchaseOrderName_} สำเร็จ`
            }).then(() => doGetPurchaseOrder());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ลบสั่งซื้อ ${purchaseOrderName_} ล้มเหลว`
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
