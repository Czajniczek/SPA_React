import React from 'react'
import { useLocation } from 'react-router-dom'

const BookEdit = () => {
    const location = useLocation()
    const book = location.state.book
    console.log(book)

    return (
        <div>

        </div>
    )
}

export default BookEdit