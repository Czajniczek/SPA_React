import React from 'react'
import { useLocation } from 'react-router-dom'

const ClientEdit = () => {
    const location = useLocation()
    const client = location.state.client
    console.log(client)

    return (
        <div>

        </div>
    )
}

export default ClientEdit