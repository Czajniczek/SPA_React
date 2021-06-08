import React, { useState, useEffect } from 'react'
import { apiClient } from "../apiClient/apiClient"

const MainPage = () => {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])

    useEffect(() => {
        apiClient.get("/Home/All")
            .then(resp => {
                const { data } = resp
                setValues(data)
                setLoading(true)
            })
    }, [])

    if (!loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div>
            {values.map((elem, index) => {
                return (
                    <p>{elem} {index}</p>
                )
            })
            }
        </div>
    )
}

export default MainPage