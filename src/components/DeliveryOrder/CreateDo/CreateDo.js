import React, { useState, useEffect } from 'react'
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import LoadingScreen from '../../main/LoadingScreen/LoadingScreen'
import { OK, apiName, key } from '../../../constants'
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../../utils/HttpClient';
import MaterialReactTable from 'material-react-table';
import Swal from "sweetalert2";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateDo() {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoad, setisLoad] = useState(false)

  const [status, setstatus] = useState('Inprocess')
  const [deliveryDate, setdeliveryDate] = useState(moment().startOf('D').toDate())
  const [description, setdescription] = useState('')

  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(moment().startOf('D').toDate())
  const [vat, setvat] = useState('')
  const [tempDoNumber, settempDoNumber] = useState(null)
  const [tempDoDate, settempDoDate] = useState(null)
  const [tempDoQty, settempDoQty] = useState(0)

  const [listPoDetail, setlistPoDetail] = useState([])
  const [doDetailData, setdoDetailData] = useState([])
  const [c, setc] = useState(0)

  //Use Effect
  useEffect(() => {
    doGetPoDetailResult()
  }, [])

  //Action
  const doGetPoDetailResult = async () => {
    try {
      const { poDetailNumber } = params
      setisLoad(true)
      const response = await httpClient.get(apiName.purchaseOrder.detail + 'listPoDetailId=' + poDetailNumber)
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        setlistPoDetail(response.data.result)
        const listPurchaseOrderDetailNumber = response.data.result.map(item => ({ purchaseOrderDetailNumber: item.purchaseOrderDetailNumber }))
        setdoDetailData(listPurchaseOrderDetailNumber)
      }

    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doCreateDo = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มรายการส่งสินค้า`,
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
          const result = await httpClient.post(apiName.do.deliveryOrder,
            {
              deliveryStatus: status,
              deliveryDate,
              description,
              createdBy: localStorage.getItem(key.user_id),
              invoiceNumber,
              invoiceDate,
              vat,
              tempDoNumber,
              tempDoDate,
              tempDoQty,
            }
          )


          console.log(result.data);
          if (result.data.api_result == OK) {
            let deliveryOrderNumber = result.data.result.deliveryOrderNumber
            for (const item of doDetailData) {
              console.log(item);
              let newItem = { ...item, deliveryOrderNumber, createdBy: localStorage.getItem(key.user_id) }
              console.log(newItem);
              await httpClient.post(apiName.do.deliveryOrderDetail, newItem)
              await httpClient.patch(apiName.purchaseOrder.detail, { purchaseOrderDetailNumber: item.purchaseOrderDetailNumber, finishedQuantity: parseInt(item.finishedQuantity)  + parseInt(item.deliveryOrderQty ) })
            }

            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มรายการส่งสินค้า สำเร็จ`
            }).then(() => {
              navigate('/DeliveryOrder/Report')
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มรายการส่งสินค้า ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        } finally {
          setisLoad(false)
        }

      }
    })
  }
  const doReset = () => {

  }
  const setDeliverQty = (value, purchaseOrderDetailNumber, unitPrice, finishedQuantity) => {
    const targetDoDetailData = doDetailData.filter(item => item.purchaseOrderDetailNumber === purchaseOrderDetailNumber)
    targetDoDetailData[0].deliveryOrderQty = parseInt(value);
    targetDoDetailData[0].unitPrice = unitPrice;
    targetDoDetailData[0].finishedQuantity = parseInt(finishedQuantity);
    setc(c + 1)
    //set settempDoQty
    settempDoQty(doDetailData.map(item => item.deliveryOrderQty ?? 0).reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
  }

  //Render
  const renderDoDetail = () => {
    return (
      <>
        <div className="form-group col-sm-4 resizeable">
          <label >
            สถานะ (Status)</label>
          <select
            value={status}
            onChange={(e) => setstatus(e.target.value)}
            required
            className="form-control" >
            <option value={'Inprocess'}>{'ดำเนินการ'}</option>
            <option value={'Done'}>{'เสร็จสิ้น'}</option>
          </select>
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
          <label >วันที่ส่งของ</label>
          <DatePicker
            className="form-control"
            selected={deliveryDate}
            onChange={(date) => setdeliveryDate(moment(date).startOf('D').toDate())}
          />

        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >รายละเอียด (Description)</label>
          <input
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >เลขที่ใบเสร็จ (Invoice Number)</label>
          <input
            required
            value={invoiceNumber}
            onChange={(e) => setinvoiceNumber(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
          <label >วันที่ออกใบเสร็จ</label>
          <DatePicker
            className="form-control"
            selected={invoiceDate}
            onChange={(date) => setinvoiceDate(moment(date).startOf('D').toDate())}
          />

        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >ภาษีมูลค่าเพิ่ม (Vat%)</label>
          <input
            type='number'
            value={vat}
            onChange={(e) => setvat(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >เลขใบส่งของชั่วคราว (Tempolary delivery order number)</label>
          <input
            value={tempDoNumber}
            onChange={(e) => settempDoNumber(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
          <label >วันที่ใบส่งของชั่วคราว (Tempolary delivery order date)</label>
          <DatePicker
            className="form-control"
            selected={tempDoDate}
            onChange={(date) => settempDoDate(moment(date).startOf('D').toDate())}
          />

        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >จำนวนใบส่งของชั่วคราว (Tempolary delivery order Qty)</label>
          <input
            type='number'
            value={tempDoQty}
            onChange={(e) => settempDoQty(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >ราคารวม (Total price)</label>
          <br />
          <NumericFormat thousandSeparator="," value={doDetailData.map(item => ((parseFloat(item.deliveryOrderQty ?? 0)) * (parseFloat(item.unitPrice ?? 0)))).reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(2)} displayType="text" />
        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >ราคารวม vat (Total price include vat)</label>
          <br />
          <NumericFormat thousandSeparator="," value={(doDetailData.map(item => ((parseFloat(item.deliveryOrderQty ?? 0)) * (parseFloat(item.unitPrice ?? 0)))).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) * (1 + (vat / 100))).toFixed(2)} displayType="text" />
        </div>
      </>
    )
  }
  const renderPoDetail = () => {
    const columns = [
      {
        header: 'PO',
        accessorKey: 'purchaseOrderName', //simple accessorKey pointing to flat data
      },
      {
        header: 'Drawing',
        accessorKey: 'drawing', //simple accessorKey pointing to flat data
      },
      {
        header: 'Description',
        accessorKey: 'description', //simple accessorKey pointing to flat data
      },
      {
        header: 'QTY/Finished',
        accessorKey: 'quantity', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <NumericFormat thousandSeparator="," value={row.original.finishedQuantity} displayType="text" />/<NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" />
        </>
      },
      {
        header: 'Deliver Qty',
        accessorKey: 'purchaseOrderDetailNumber', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <div className="form-group">
            <input
              type='number'
              min={1}
              step={1}
              // placeholder={row.original.finishedQuantity <= row.original.deliveredqty ? 'Can not deliver this PO' : ''}
              max={row.original.quantity - row.original.deliveredqty}
              onChange={(e) => setDeliverQty(e.target.value, cell.getValue(), row.original.unitPrice, row.original.finishedQuantity)}
              required
              className="form-control"
            />
          </div>
        </>
      },
      {
        header: 'Delivered Qty',
        accessorKey: 'deliveredqty', //simple accessorKey pointing to flat data
      },
      {
        header: 'MICRON#',
        accessorKey: 'quotationNumber', //simple accessorKey pointing to flat data
      },
      {
        header: 'Unit price',
        accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={cell.getValue()} displayType="text" /> : <></>
      },
      {
        header: 'Total price',
        accessorKey: 'unitPrice', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={doDetailData.find(item => item.purchaseOrderDetailNumber === row.original.purchaseOrderDetailNumber).deliveryOrderQty * cell.getValue() * (1 + (vat / 100))} displayType="text" /> : <></>

      },
      {
        header: 'Commit date',
        accessorKey: 'commitDate', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => cell.getValue() == null || cell.getValue() === '' ? '' : moment(cell.getValue()).format("DD-MMM-YY")
      },
    ]

    try {
      if (listPoDetail.length > 0) {
        return (
          <div className="col-md-12" style={{ zIndex: 0 }}>
            <MaterialReactTable
              enableColumnResizing
              enableColumnOrdering
              enableStickyHeader
              enableStickyFooter
              enablePagination={true}
              initialState={{ pagination: { pageSize: 100, } }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 50, 100, 150, 200, 250, 300],
              }}
              columns={columns}
              data={listPoDetail}
            />
          </div>
        )
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="content-wrapper ">
      <ContentHeader header="เพิ่มรายการส่งสินค้า" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <form className="card card-dark" onSubmit={(e) => {
                e.preventDefault()
                doCreateDo()
              }}>
                <div className="card-header bg-main">
                  <div className="card-title">
                  </div>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" />
                    </button>
                  </div>
                </div>

                <div className="card-body row">
                  {renderDoDetail()}
                  {renderPoDetail()}
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary">ตกลง</button>
                  <button type="reset" className="btn btn-default float-right" onClick={() => doReset()} >ยกเลิก</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
