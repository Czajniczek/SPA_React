//#region Imports
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import SaveIcon from '@material-ui/icons/Save'
import { Form, Formik, Field } from 'formik'
import { Button } from '@material-ui/core'
import { apiClient } from '../apiClient/apiClient'
import CircularProgress from '@material-ui/core/CircularProgress'
import { FormikTextField } from 'formik-material-fields'
//#endregion Imports

//#region Main function
const OrderAddEdit = ({ initValues, isEdit, closeModal }) => {
    //#region Hooks
    const [clients, setClient] = useState([])
    const [books, setBook] = useState([])
    const [clientsIsLoading, setClientsIsLoading] = useState(false)
    const [booksIsLoading, setBooksIsLoading] = useState(false)
    //#endregion Hooks

    //#region Load data from API
    useEffect(() => {
        apiClient.get("/api/Books")
            .then(resp => {
                const { data } = resp
                setBook(data)
                setBooksIsLoading(true)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        apiClient.get("/api/Clients")
            .then(resp => {
                const { data } = resp
                setClient(data)
                setClientsIsLoading(true)
            })
            .catch(err => console.log(err))
    }, [])

    if (!clientsIsLoading || !booksIsLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress style={{ height: 80, width: 80 }} />
                <h3>Loading data ...</h3>
            </div>
        )
    }
    //#endregion Load data from API

    //#region Form
    // console.log(initValues)
    // console.log(isEdit)
    // console.log(closeModal)

    const initialValues = {
        clientId: initValues.client?.clientId ?? 0,
        bookId: initValues.book?.bookId ?? 0,
        orderDate: new Date(),
        count: initValues.count
    }

    const validationSchema = Yup.object({
        clientId: Yup.number().moreThan(0).required("Client is required!"),
        bookId: Yup.number().moreThan(0).required("Book is required!"),
        count: Yup.number().moreThan(0).required("Count is required")
    })
    //#endregion Form

    //#region Submit form
    const submitForm = values => {
        if (isEdit) {
            apiClient.put(`/api/Orders/${initValues.orderId}`, { ...values, orderId: initValues.orderId })
                .then(resp => {
                    if (resp.status === 200) {
                        const { data } = resp
                        closeModal(data)
                    }
                })
        }
        else {
            apiClient.post('/api/Orders', values)
                .then(resp => {
                    if (resp.status === 200) {
                        const { data } = resp
                        closeModal(data)
                    }
                })
        }
    }
    //#endregion Submit form

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitForm}
        >
            {
                formik => {
                    //console.log(formik)
                    return (
                        <Form style={{ marginBottom: '16px', background: 'white', display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor='cliendId' style={{ marginTop: '10px', marginBottom: '10px', color: 'rgba(0, 0, 0, 0.54)', padding: '0px', fontSize: '1rem', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontWeight: '400', lineHeight: '1', letterSpacing: '0.00938em', transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>Client name</label>
                            <Field
                                style={{ padding: '5px', fontSize: '15px' }}
                                name='clientId'
                                id='clientId'
                                as='select'
                            >
                                <option value={0} key={''}>---</option>
                                {
                                    clients.map((client, index) => {
                                        return (
                                            <option value={client.clientId} key={index}>{client.name} {client.surname}</option>
                                        )
                                    })
                                }
                            </Field>
                            <label htmlFor='bookId' style={{ marginTop: '10px', marginBottom: '10px', color: 'rgba(0, 0, 0, 0.54)', padding: '0px', fontSize: '1rem', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontWeight: '400', lineHeight: '1', letterSpacing: '0.00938em', transform: 'translate(0, 1.5px) scale(0.75)', transformOrigin: 'top left' }}>Book</label>
                            <Field
                                style={{ padding: '5px', fontSize: '15px' }}
                                name='bookId'
                                id='bookId'
                                as='select'
                            >
                                <option value={0} key={''}>---</option>
                                {
                                    books.map((book, index) => {
                                        return (
                                            <option value={book.bookId} key={index}>{book.title}</option>
                                        )
                                    })
                                }
                            </Field>
                            <FormikTextField
                                type='number'
                                id='count'
                                name='count'
                                label='Count'
                                margin='normal'
                            />
                            <Button
                                style={{ marginTop: 20, width: '120px', marginLeft: 'auto', marginRight: 'auto' }}
                                type='submit'
                                variant='contained'
                                color='primary'
                                startIcon={<SaveIcon />}
                                disabled={!formik.isValid}
                            >
                                SAVE
                            </Button>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}
//#endregion Main function

export default OrderAddEdit