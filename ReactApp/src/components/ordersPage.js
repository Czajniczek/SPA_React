//#region Imports
import React, { useState, useEffect } from 'react'
import { apiClient } from "../apiClient/apiClient"
import CircularProgress from '@material-ui/core/CircularProgress'
import { DataGrid } from '@material-ui/data-grid'
import { format } from 'date-fns'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import OrderAddEdit from './orderAddEdit'
//#endregion Imports

//#region Main function
const OrdersPage = () => {
    //#region Hooks
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [edited, setEdited] = useState({})
    //#endregion Hooks

    //#region Load data from API
    useEffect(() => {
        apiClient.get("/api/Orders")
            .then(resp => {
                const { data } = resp
                setValues(data)
                setLoading(true)
            })
    }, [])

    if (!loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '200px' }}>
                <CircularProgress style={{ height: 80, width: 80 }} />
                <h3>Loading orders data ...</h3>
            </div>
        )
    }
    //#endregion Load data from API

    //#region Create columns and rows for table
    const columns = [
        // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'clientName', headerName: 'Client', width: 250, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'bookTitle', headerName: 'Book', width: 260, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'orderDate', headerName: 'Order date', width: 150, type: 'date', headerAlign: 'center', align: 'center' },
        { field: 'count', headerName: 'Count', width: 120, type: 'number', headerAlign: 'center', align: 'center' },
        {
            field: 'cost', headerName: 'Cost', width: 150, type: 'number', headerAlign: 'center', align: 'center',
            valueFormatter: (params) => {
                const valueFormatted = Number(params.value).toLocaleString();
                return `${valueFormatted} zł`
            }
        },
        {
            field: 'total', headerName: 'Total', width: 150, type: 'number', headerAlign: 'center', align: 'center',
            valueFormatter: (params) => {
                const valueFormatted = Number(params.value).toLocaleString();
                return `${valueFormatted} zł`
            }
        },
        { field: 'id', headerName: 'Action', width: 130, headerAlign: 'center', align: 'center', disableClickEventBubbling: true, renderCell: (params) => getRowButton(params) }
    ]

    const rows = values.map((order) => ({
        id: order.orderId,
        clientName: order.client.name + " " + order.client.surname,
        bookTitle: order.book.title,
        orderDate: format(new Date(order.orderDate), 'dd-MM-yyyy hh:mm'),
        count: order.count,
        cost: order.book.cost,
        total: order.count * order.book.cost
    }))
    //#endregion Create columns and rows for table

    //#region Create action buttons
    const getRowButton = ({ value }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton aria-label="edit" onClick={() => handleEdit(value)}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(value)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        )
    }
    //#endregion Create action buttons

    //#region Handle actions (CREATE, EDIT, DELETE)
    const handleAdd = () => {
        setEdited({})
        setIsEdit(false)
        setShowModal(true)
    }

    const handleAddOrderModal = (values) => {
        setShowModal(false)
        setValues(prev => {
            return [...prev, values]
        })
    }

    const handleEdit = (value) => {
        var order = values.filter(x => x.orderId === value);
        setEdited(order[0])
        setIsEdit(true)
        setShowModal(true)
    }

    const handleEditOrderModal = (values) => {
        setShowModal(false)
        setValues(prev => {
            let local = prev
            let index = local.findIndex(x => x.orderId === values.orderId)

            if (index !== -1) {
                local.splice(index, 1, values)
                return [...local]
            }

            return [...local]
        })
    }

    const handleDelete = (value) => {
        apiClient.delete(`/api/Orders/${value}`)
            .then(resp => {
                if (resp.status === 204) {
                    const index = values.findIndex(x => x.orderId === value)
                    if (index !== -1) {
                        setValues(prev => {
                            let local = prev
                            local.splice(index, 1)
                            return [...local]
                        })
                    }
                }
            })
    }
    //#endregion Handle actions (CREATE, EDIT, DELETE)

    return (
        <div style={{ width: 'auto', margin: '20px' }}>
            <Dialog
                open={showModal}
                maxWidth='xs'
                fullWidth={true}
                onBackdropClick={() => setShowModal(false)}
                onEscapeKeyDown={() => setShowModal(false)}
            >
                <DialogTitle>
                    {isEdit ? "EDIT ORDER" : "ADD ORDER"}
                </DialogTitle>
                <DialogContent>
                    <OrderAddEdit
                        initValues={edited}
                        isEdit={isEdit}
                        closeModal={isEdit ? handleEditOrderModal : handleAddOrderModal}
                    />
                </DialogContent>
            </Dialog>
            <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
            <Fab color="primary" aria-label="Add client" onClick={handleAdd} style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
                <AddIcon />
            </Fab>
        </div>
    )
}
//#endregion Main function

export default OrdersPage