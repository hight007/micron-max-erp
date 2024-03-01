import React, { useState, useEffect, useMemo } from 'react'
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import LoadingScreen from '../../main/LoadingScreen/LoadingScreen'
import { httpClient } from '../../../utils/HttpClient'
import { OK, apiName, key } from '../../../constants'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import MaterialReactTable from 'material-react-table';
import { NumericFormat } from "react-number-format";
import moment from "moment";
import _ from "lodash";
import { CSVLink } from "react-csv";
import { Box } from '@mui/material';
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";

export default function ReportDo() {
  const animatedComponents = makeAnimated();

  //Statue
  const [isLoad, setisLoad] = useState(false)
  const [keys, setkeys] = useState(0)
  const [customers, setcustomers] = useState([])

  //condition
  const [dateFrom, setdateFrom] = useState(moment().add(-1, 'M').toDate())
  const [dateTo, setdateTo] = useState(moment().endOf('d').toDate())
  const [customerId, setcustomerId] = useState(null)
  const [purchaseOrderName, setpurchaseOrderName] = useState(null)
  const [drawing, setdrawing] = useState(null)
  const [deliveryOrder, setdeliveryOrder] = useState(null)
  const [quotationNumber, setquotationNumber] = useState(null)
  const [deliveryStatus, setdeliveryStatus] = useState(null)

  //Result
  const [reportResult, setreportResult] = useState([])

  useEffect(() => {
    doGetCustomer()
  }, [])

  //Action
  const doGetCustomer = async () => {
    try {
      const response = await httpClient.get(apiName.master.customer + 'getAll')
      if (response.data.api_result === OK) {
        setcustomers(response.data.result.map(item => ({ value: item.customerId, label: item.customerName })))
      }
    } catch (error) {
      console.log(error);
    }
  }
  const doGetDeliveryOrder = async () => {
    try {
      let condition = {}

      if (dateFrom != '' && dateFrom != null) {
        condition.dateFrom = moment(dateFrom).format('YYYY-MM-DD')
      }
      if (dateTo != '' && dateTo != null) {
        condition.dateTo = moment(dateTo).format('YYYY-MM-DD')
      }
      if (deliveryStatus != '' && deliveryStatus != null) {
        condition.deliveryStatus = deliveryStatus
      }

      if (purchaseOrderName != '' && purchaseOrderName != null) {
        condition.purchaseOrderName = (purchaseOrderName.split('\n')).map(item => item.trim())
      }

      console.log(customerId);
      if (customerId != '' && customerId != null) {
        condition.customerId = customerId
      }

      if (drawing != '' && drawing != null) {
        condition.drawing = (drawing.split('\n')).map(item => item.trim())
      }

      if (deliveryOrder != '' && deliveryOrder != null) {
        condition.deliveryOrder = (deliveryOrder.split('\n')).map(item => item.trim())
      }

      if (quotationNumber != '' && quotationNumber != null) {
        condition.quotationNumber = (quotationNumber.split('\n')).map(item => item.trim())
      }

      setisLoad(true)
      const response = await httpClient.post(apiName.do.report, { condition })
      setreportResult(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doReset = () => {
    setcustomerId(null)
    setpurchaseOrderName(null)
    setdrawing(null)
    setdeliveryOrder(null)
    setquotationNumber(null)
    setdeliveryStatus(null)
    setkeys(keys + 1)
    setdateFrom(moment().add(-1, 'M').toDate())
    setdateTo(moment().startOf('D').toDate())
  }
  const handleExportData = (rows) => {
    // let data = rows.map((row) => row.original)
    let data_ = reportResult
    let data = _.cloneDeep(data_);
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      item.purchaseOrderName = `=""${item.purchaseOrderName}""`
      item.commitDate = moment(item.commitDate).format('YYYY-MM-DD')
      item.deliveryDate = moment(item.deliveryDate).format('YYYY-MM-DD')
    }

    return data;
  };
  const handleExportSelectedData = (rows) => {
    let data_ = rows.map((row) => row.original)
    let data = _.cloneDeep(data_);
    // let data = reportResult
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      item.purchaseOrderName = `=""${item.purchaseOrderName}""`
      item.commitDate = moment(item.commitDate).format('YYYY-MM-DD')
      item.deliveryDate = moment(item.deliveryDate).format('YYYY-MM-DD')
    }

    return data;
  };

  //Render
  const renderSearchCondition = () => {

    return (
      <div className="col-md-12 row">
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
        <div className="form-group col-md-4 resizeable">

        </div>
        <div className="form-group col-sm-4 resizeable">
          <i className="fas fa-user-check" style={{ marginRight: 10 }} />
          <label >ชื่อลูกค้า (Customer)</label>
          <Select
            key={keys} // Use the key prop
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={customers}
            onChange={(e) => {
              setcustomerId(e.map(item => item.value));
            }}
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} />
          <label >ใบสั่งซื้อ (Purchase Order)</label>
          <textarea
            value={purchaseOrderName}
            onChange={(e) => setpurchaseOrderName(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="fas fa-pencil-ruler" style={{ marginRight: 10 }} />
          <label >แบบแปลน (Drawing)</label>
          <textarea
            value={drawing}
            onChange={(e) => setdrawing(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        <div className="form-group col-sm-4 resizeable">
          <i className="fas fa-toggle-off" style={{ marginRight: 10 }} />
          <label >สถานะ (Status)</label>
          <Select
            key={keys} // Use the key prop
            closeMenuOnSelect={true}
            components={animatedComponents}
            defaultValue={{ value: null, label: 'ทั้งหมด' }}
            options={[{ value: null, label: 'ทั้งหมด' }, { value: 'Inprocess', label: 'ดำเนินการ' }, { value: 'Done', label: 'เสร็จสิ้น' }]}
            onChange={(e) => {
              setdeliveryStatus(e.value);
            }}
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="fas fa-truck-loading" style={{ marginRight: 10 }} />
          <label >เลขที่ส่งสินค้า (Delivery order number)</label>
          <textarea
            value={deliveryOrder}
            onChange={(e) => setdeliveryOrder(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="fas fa-file-signature" style={{ marginRight: 10 }} />
          <label >เลขที่ใบเสนอราคา (Quotation Number)</label>
          <textarea
            value={quotationNumber}
            onChange={(e) => setquotationNumber(e.target.value)}
            className="form-control"
            rows={3}
          />
        </ div>
      </div>
    )
  }
  const renderResultTable = useMemo(() => {
    const getColor = (piority) => {
      switch (piority) {
        case 1: return '#ff7c80'

        case 2: return '#fde499'

        default: return '#b5f0b3'

      }
    }

    const columns = [
      {
        header: 'Edit',
        accessorKey: 'deliveryOrderNumber', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <Link className="btn btn-default" target="_blank" to={`/DeliveryOrder/Update/${cell.getValue()}`}>
          <i className="fas fa-edit" />
        </Link>
      },
      {
        header: 'Delivery Order Name',
        accessorKey: 'deliveryOrderName', //simple accessorKey pointing to flat data
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
        header: 'PO DESCRIPTION',
        accessorKey: 'description', //simple accessorKey pointing to flat data
      },
      {
        header: 'DO DESCRIPTION',
        accessorKey: 'deliveryDescription', //simple accessorKey pointing to flat data
      },
      {
        header: 'QTY',
        accessorKey: 'quantity', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <NumericFormat thousandSeparator="," value={row.original.finishedQuantity} displayType="text" />/<NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />
        </>
      },
      {
        header: 'Delivery QTY',
        accessorKey: 'deliveryOrderQty', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />
        </>
      },
      {
        header: 'STATUS',
        accessorKey: 'statusEn', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == 'Inprocess' ?
          <button className="btn btn-warning btn-xs">ดำเนินการ</button> :
          <button className="btn btn-success btn-xs">เสร็จสิ้น</button>
      },
      {
        header: 'MICRON#',
        accessorKey: 'quotationNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'Unit Price',
        accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" /> : <>{key.user_level}</>
      },
      {
        header: 'Delivery price',
        accessorKey: 'deliveryPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" /> : <>{key.user_level}</>
      },
      {
        header: 'Delivery price (vat)',
        accessorKey: 'deliveryPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={(cell.getValue() * (1 + (row.original.vat / 100))).toFixed(2)} displayType="text" /> : <>{key.user_level}</>
      },
      {
        header: 'Customer',
        accessorKey: 'customerName', //simple accessorKey pointing to flat data
      },
      {
        header: 'Delivery Date',
        accessorKey: 'deliveryDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <div style={{ backgroundColor: getColor(row.original.piority), textAlign: 'center', borderRadius: 10 }}>{cell.getValue() == null || cell.getValue() == '' || cell.getValue() == 'Invalid date' ? '' : moment(cell.getValue()).format("DD-MMM-YY")}</div>
      },
      {
        header: 'Commited Date PO',
        accessorKey: 'commitDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <div style={{ backgroundColor: getColor(row.original.piority), textAlign: 'center', borderRadius: 10 }}>{cell.getValue() == null || cell.getValue() == '' || cell.getValue() == 'Invalid date' ? '' : moment(cell.getValue()).format("DD-MMM-YY")}</div>
      },
      {
        header: 'Delivery Status',
        accessorKey: 'deliveryStatus', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() === 'Inprocess' ? 'ดำเนินการ' : 'เสร็จสิ้น'
      },
    ]

    const headers = [
      { label: "Delivery Order Name", key: "deliveryOrderName" },
      { label: "PO#", key: "purchaseOrderName" },
      { label: "DRAWING#", key: "drawing" },
      { label: "PO DESCRIPTION", key: "description" },
      { label: "DO DESCRIPTION", key: "deliveryDescription" },
      { label: "QTY", key: "quantity" },
      { label: "FinishedQty", key: "finishedQuantity" },
      { label: "Delivery QTY", key: "deliveryOrderQty" },
      { label: "MICRON#", key: "quotationNumber" },
      { label: "Unit Price", key: ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? "unitPrice" : "" },
      { label: "Delivery Price", key: ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? "deliveryPrice" : "" },
      { label: "Customer", key: "customerName" },
      { label: "Delivery Date", key: "deliveryDate" },
      { label: "Commited Date PO", key: "commitDate" },
      { label: "Delivery Status", key: "deliveryStatus" }

    ];

    return (
      <div className="col-md-12">
        <MaterialReactTable
          // key={key}
          enableColumnResizing
          columnResizeMode="onChange"
          columns={columns}
          data={reportResult}
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
            rowsPerPageOptions: [10, 50, 100, 150, 200, 250, 300],
          }}
          positionToolbarAlertBanner="bottom"
          renderTopToolbarCustomActions={({ table }) => {
            return (
              <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                <CSVLink className="btn btn-primary"
                  data={handleExportData(table.getRowModel().rows)}
                  filename={`Report_Delivery_Order_${moment().format('DD-MMM-YY')}.csv`}
                  headers={headers}
                >
                  <i className="fas fa-file-csv" style={{ marginRight: 10 }} />ส่งออกข้อมูลเป็น CSV
                </CSVLink>
                <CSVLink className="btn btn-primary"
                  data={handleExportSelectedData(table.getSelectedRowModel().rows)}
                  filename={`Report_Delivery_Order_${moment().format('DD-MMM-YY')}.csv`}
                  headers={headers}
                >
                  <i className="fas fa-file-csv" style={{ marginRight: 10 }} />ส่งออกข้อมูลเป็น CSV
                </CSVLink>
              </Box>
            )
          }}
        />
      </div>
    )
  }, [reportResult])

  return (
    <div className="content-wrapper ">
      <ContentHeader header="รายงานการส่งสินค้า (Report Delivery Order)" />
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
                  <button type="submit" onClick={(e) => doGetDeliveryOrder()} className="btn btn-primary">ค้นหา</button>
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
                  {renderResultTable}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
