import Modal from 'react-modal';
import React, { useEffect, useState } from 'react'
import { apiName, key, OK } from '../../../constants'
import { httpClient } from '../../../utils/HttpClient'
import ContentHeader from '../../main/ContentHeader/ContentHeader'
import LoadingScreen from '../../main/LoadingScreen'
import Swal from 'sweetalert2';
import MaterialReactTable from 'material-react-table';
import moment from 'moment';

export default function Customer() {
  const [isLoad, setisLoad] = useState(false)
  const [modalIsOpen, setmodalIsOpen] = useState(false)

  const [customerName, setcustomerName] = useState('')
  const [description, setdescription] = useState('')

  const [customers, setcustomers] = useState([])

  useEffect(() => {
    doGetCustomer()
  }, [])

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

  const closeModal = () => {
    setmodalIsOpen(false)
  }

  const openModal = () => {
    setmodalIsOpen(true)
  }

  const renderModalCreateUser = () => {
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

          <div className="card card-primary">
            <div className="card-header">
              <h3 class="card-title">เพิ่มลูกค้า</h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool" onClick={(e) => {
                  closeModal();
                }}><i className="fas fa-times" />

                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              doCreateCustomer()
            }}>
              <div className="card-body row">
                <div className="col-sm-12" style={{ textAlign: 'center' }}>
                  <img
                    src="/dist/images/MicromMax logo.jpg"
                    alt="spectrumPro Logo"

                    style={{ opacity: "1", width: "15%", }}
                  />
                  <hr />
                </div>
                <div className="form-group col-sm-12">
                  <label >ชื่อลูกค้า (Customer name)</label>
                  <input value={customerName} onChange={(e) => setcustomerName(e.target.value)} required className="form-control" placeholder="กรอกชื่อลูกค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <label >รายละเอียด (Description)</label>
                  <input value={description} onChange={(e) => setdescription(e.target.value)} required className="form-control" placeholder="กรอกรายละเอียดลูกค้า" />
                </div>

              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-primary">ตกลง</button>
                <button type="reset" onClick={() => closeModal()} className="btn btn-default float-right">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  }

  const doCreateCustomer = async () => {
    try {
      Swal.fire({
        title: 'โปรดยืนยัน',
        text: `ต้องการเพิ่มลูกค้า ${customerName}`,
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
            const response = await httpClient.post(apiName.master.customer, { customerName, description, createdBy: localStorage.getItem(key.user_id) })
            setisLoad(false)
            if (response.data.api_result == OK) {
              doGetCustomer()
              Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: `เพิ่มลูกค้า ${customerName} สำเร็จ`
              }).then(() => closeModal());
            } else {
              Swal.fire({
                icon: 'error',
                title: 'ล้มเหลว',
                text: `เพิ่มลูกค้า ${customerName} ล้มเหลว`
              })
            }
          } catch (error) {
            console.log(error);
            setisLoad(false)
          }

        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const renderCustomer = () => {
    const columns = [
      {
        header: 'ชื่อลูกค้า',
        accessorKey: 'customerName', //simple accessorKey pointing to flat data
      },
      {
        header: 'รายละเอียด',
        accessorKey: 'description', //simple accessorKey pointing to flat data
      },
      {
        header: 'วันที่สร้าง',
        accessorKey: 'createdAt', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
      },
      {
        header: 'สร้างโดย',
        accessorKey: 'createdby', //simple accessorKey pointing to flat data 
      },
      {
        header: 'วันที่แก้ไข',
        accessorKey: 'updatedAt', //simple accessorKey pointing to flat data
        Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
      },
      {
        header: 'แก้ไขโดย',
        accessorKey: 'updatedBy', //simple accessorKey pointing to flat data

      },
    ]

    if (customers.length > 0) {
      return <MaterialReactTable
        columns={columns}
        data={customers}
        enableColumnOrdering
        positionToolbarAlertBanner="bottom"
      />
    }


  }

  return (
    <div className="content-wrapper">
      <ContentHeader header="จัดการลูกค้า (Customer master)" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          {renderModalCreateUser()}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header" style={{ textAlign: "center" }}>
                  <button className="btn btn-primary" onClick={() => { openModal() }}>
                    <i className="fas fa-user-plus" style={{ marginRight: 5 }} />
                    เพิ่มลูกค้า
                  </button>

                </div>
                <div className="card-body row">
                  <div className="col-md-12">
                    {renderCustomer()}
                  </div>

                </div>
                <div className="card-footer">
                  {/* <button type="submit" onClick={(e) => doGetPurchaseOrder()} className="btn btn-primary">ค้นหา</button>
                    <button type="reset" className="btn btn-default float-right" onClick={() => doReset()} >ยกเลิก</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
