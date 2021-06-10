import React, { useState, useEffect } from 'react'
import { apiClient } from "../apiClient/apiClient"
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataGrid } from '@material-ui/data-grid'
import { useHistory } from 'react-router'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

const ClientsPage = () => {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])
    const history = useHistory()

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
            <div>
                <CircularProgress style={{ height: 80, width: 80, marginLeft: "auto", marginRight: "auto", display: "flex", marginTop: 200 }} />
            </div>
        )
    }
    //#endregion Load data from API

    //#region Create columns and rows for table
    const columns = [
        // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'surname', headerName: 'Surname', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'adress', headerName: 'Adress', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'phoneNumber', headerName: 'Phone number', width: 190, type: 'date', headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'E-mail', width: 220, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'id', headerName: 'Actions', width: 130, headerAlign: 'center', align: 'center', disableClickEventBubbling: true, renderCell: (params) => getRowButton(params) }
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
                {/* <div style={{ display: 'flex', flexShrink: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <StyledButton onClick={() => handleEdit(value)}>
                    EDIT
                </StyledButton>
                <StyledButton onClick={() => handleDelete(value)}>
                    DELETE
                </StyledButton> */}
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
    const handleEdit = (value) => {
        var client = values.filter(x => x.clientId === value);

        history.push('/ClientEdit', { client })
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
        <div>
            <div style={{ height: 300, width: 1000, marginLeft: 'auto', marginRight: 'auto', marginTop: 20 }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
            </div>
        </div>
    )
}

export default ClientsPage