//#region Imports
import React, { useState, useEffect } from 'react'
import { apiClient } from "../apiClient/apiClient"
import CircularProgress from '@material-ui/core/CircularProgress'
import { DataGrid } from '@material-ui/data-grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import ClientAddEdit from './clientAddEdit'
//#endregion Imports

//#region Main function
const ClientsPage = () => {
    //#region Hooks
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [edited, setEdited] = useState({})
    //#endregion Hooks

    //#region Load data from API
    useEffect(() => {
        apiClient.get("/api/Clients")
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
                <h3>Loading clients data ...</h3>
            </div>
        )
    }
    //#endregion Load data from API

    //#region Create columns and rows for table
    const columns = [
        // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'surname', headerName: 'Surname', width: 230, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'adress', headerName: 'Adress', width: 250, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'phoneNumber', headerName: 'Phone number', width: 170, type: 'date', headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'E-mail', width: 290, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'id', headerName: 'Action', width: 130, headerAlign: 'center', align: 'center', disableClickEventBubbling: true, renderCell: (params) => getRowButton(params) }
    ]

    const rows = values.map((client) => ({
        id: client.clientId,
        name: client.name,
        surname: client.surname,
        adress: client.adress,
        phoneNumber: client.phoneNumber,
        email: client.email
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

    const handleAddClientModal = (values) => {
        setShowModal(false)
        setValues(prev => {
            return [...prev, values]
        })
    }

    const handleEdit = (value) => {
        var client = values.filter(x => x.clientId === value);
        setEdited(client[0])
        setIsEdit(true)
        setShowModal(true)
    }

    const handleEditClientModal = (values) => {
        // debugger;
        setShowModal(false)
        setValues(prev => {
            let local = prev
            let index = local.findIndex(x => x.clientId === values.clientId)

            if (index !== -1) {
                local.splice(index, 1, values)
                return [...local]
            }

            return [...local]
        })
    }

    const handleDelete = (value) => {
        apiClient.delete(`/api/Clients/${value}`)
            .then(resp => {
                if (resp.status === 204) {
                    const index = values.findIndex(x => x.clientId === value)
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
                    {isEdit ? "EDIT CLIENT" : "ADD CLIENT"}
                </DialogTitle>
                <DialogContent>
                    <ClientAddEdit
                        initValues={edited}
                        isEdit={isEdit}
                        closeModal={isEdit ? handleEditClientModal : handleAddClientModal}
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

export default ClientsPage