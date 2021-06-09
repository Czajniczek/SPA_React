import React, { useState, useEffect } from 'react'
import { apiClient } from "../apiClient/apiClient"
import CircularProgress from '@material-ui/core/CircularProgress';

const OrdersPage = () => {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])

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
            <div>
                <CircularProgress style={{ height: 80, width: 80, marginLeft: "auto", marginRight: "auto", display: "flex", marginTop: 200 }} />
            </div>
        )
    }

    return (
        <div>
            {values.map((elem, index) => {
                return (
                    <p key={elem.orderId}>{elem.client.name} {index}</p>
                )
            })
            }
        </div>
    )
}

export default OrdersPage