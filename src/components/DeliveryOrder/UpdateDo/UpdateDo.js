import React, { useState, useEffect } from 'react'
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import LoadingScreen from '../../main/LoadingScreen/LoadingScreen'
import { OK, apiName, key } from '../../../constants'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../../utils/HttpClient';
import MaterialReactTable from 'material-react-table';
import Swal from "sweetalert2";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateDo() {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoad, setisLoad] = useState(false)

  const [status, setstatus] = useState('ดำเนินการ')
  const [deliveryDate, setdeliveryDate] = useState(moment().startOf('D').toDate())
  const [description, setdescription] = useState('')

  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [invoiceDate, setinvoiceDate] = useState(null)
  const [vat, setvat] = useState('')
  const [tempDoNumber, settempDoNumber] = useState(null)
  const [tempDoDate, settempDoDate] = useState(null)
  const [tempDoQty, settempDoQty] = useState('')

  const [listPoDetail, setlistPoDetail] = useState([])

  useEffect(() => {
    doGetDo()
  }, [])

  //Action
  const doGetDo = async () => {
    try {
      const { deliveryOrderNumber } = params
      setisLoad(true)
      const response = await httpClient.get(apiName.do.find + deliveryOrderNumber)
      if (response.data.api_result === OK) {
        const { result } = response.data
        console.log(result);
        if (result.length > 0) {
          setstatus(result[0].deliveryStatus)
          setdeliveryDate(moment(result[0].deliveryDate).toDate())
          setdescription(result[0].doDescription)
          setinvoiceNumber(result[0].invoiceNumber)
          setinvoiceDate(moment(result[0].invoiceDate).toDate())
          setvat(result[0].vat)
          settempDoNumber(result[0].tempDoNumber)
          if (result[0].tempDoDate != null) {
            settempDoDate(moment(result[0].tempDoDate).toDate())
          }
          settempDoQty(result[0].tempDoQty)


          setlistPoDetail(result.map(item => ({ ...item, oldDeliveryQty: item.deliveryOrderQty })))
        } else {
          Swal.fire('Error', 'DO not found', 'error').then(() => {
            navigate('/DeliveryOrder/Report')
          })
        }

      }

    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doDeleted = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการลบรายการส่งสินค้า ?`,
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
          const { deliveryOrderNumber } = params
          const result = await httpClient.patch(apiName.do.deliveryOrder,
            {
              deliveryStatus: status,
              deliveryDate,
              description,
              updatedBy: localStorage.getItem(key.user_id),
              isDeleted: 1,
              deliveryOrderNumber,
            }
          )
          if (result.data.api_result == OK) {
            for (const item of listPoDetail) {

              const updateItem = {
                deliveryOrderDetailId: item.deliveryOrderDetailId,
                deliveryOrderQty: item.deliveryOrderQty,
                isDeleted: 1,
                updatedBy: localStorage.getItem(key.user_id
                )
              }

              await httpClient.patch(apiName.do.deliveryOrderDetail, updateItem)
            }

            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ลบรายการส่งสินค้า สำเร็จ`
            }).then(() => doGetDo())
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ลบรายการส่งสินค้า ล้มเหลว`
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
  const setDeliverQty = (value, purchaseOrderDetailNumber) => {
    const listPoDetail_ = listPoDetail.map(item => item)
    const targetDoDetailData = listPoDetail_.find(item => item.purchaseOrderDetailNumber === purchaseOrderDetailNumber)
    targetDoDetailData.deliveryOrderQty = parseInt(value);
    setlistPoDetail(listPoDetail_)
  }
  const doupdateDo = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการแก้ไขรายการส่งสินค้า ?`,
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
          const { deliveryOrderNumber } = params
          const result = await httpClient.patch(apiName.do.deliveryOrder,
            {
              deliveryStatus: status,
              deliveryDate,
              description,
              updatedBy: localStorage.getItem(key.user_id),
              deliveryOrderNumber,
              invoiceNumber,
              invoiceDate,
              vat,
              tempDoNumber,
              tempDoDate,
              tempDoQty,
            }
          )
          if (result.data.api_result == OK) {
            for (const item of listPoDetail) {

              const updateItem = {
                deliveryOrderDetailId: item.deliveryOrderDetailId,
                deliveryOrderQty: item.deliveryOrderQty,
                updatedBy: localStorage.getItem(key.user_id
                )
              }

              await httpClient.patch(apiName.do.deliveryOrderDetail, updateItem)
            }

            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `แก้ไขรายการส่งสินค้า สำเร็จ`
            }).then(() => doGetDo())
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `แก้ไขรายการส่งสินค้า ล้มเหลว`
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
          <label >เลขใบสั่งของ (Invoice Number)</label>
          <input
            required
            value={invoiceNumber}
            onChange={(e) => setinvoiceNumber(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4 resizeable">
          <i className="far fa-calendar-alt" style={{ marginRight: 10 }} />
          <label >วันที่ใบสั่งของ</label>
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
          <NumericFormat thousandSeparator="," value={listPoDetail.map(item => ((parseFloat(item.deliveryOrderQty ?? 0)) * (parseFloat(item.unitPrice ?? 0)))).reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(2)} displayType="text" />
        </div>
        <div className="form-group col-sm-4">
          {/* <i className="fas fa-shopping-cart" style={{ marginRight: 10 }} /> */}
          <label >ราคารวม vat (Total price include vat)</label>
          <br />
          <NumericFormat thousandSeparator="," value={(listPoDetail.map(item => ((parseFloat(item.deliveryOrderQty ?? 0)) * (parseFloat(item.unitPrice ?? 0)))).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) * (1 + (vat / 100))).toFixed(2)} displayType="text" />
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
        accessorKey: 'deliveryOrderQty', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => <>
          <div className="form-group">
            <input
              value={cell.getValue()}
              type='number'
              min={1}
              step={1}
              // placeholder={row.original.finishedQuantity <= row.original.deliveredqty ? 'Can not deliver this PO' : ''}
              max={row.original.finishedQuantity - (row.original.deliveredqty - row.original.oldDeliveryQty)}
              onChange={(e) => setDeliverQty(e.target.value, row.original.purchaseOrderDetailNumber)}
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
        Cell: ({ cell, row }) => ["admin", "power"].includes(localStorage.getItem(key.user_level)) ? <NumericFormat thousandSeparator="," value={(row.original.deliveryOrderQty * cell.getValue() * (1 + (vat / 100))).toFixed(2)} displayType="text" /> : <></>
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
      <ContentHeader header="แก้ไขรายการส่งสินค้า" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <form className="card card-dark" onSubmit={(e) => {
                e.preventDefault()
                doupdateDo()
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
                  <button type="button" className="btn btn-danger float-right" onClick={() => doDeleted()} >ลบ</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
