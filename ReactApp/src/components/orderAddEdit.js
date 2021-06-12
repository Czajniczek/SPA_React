//#region Imports
import React from 'react'
import * as Yup from 'yup'
import SaveIcon from '@material-ui/icons/Save'
import { Form, Formik } from 'formik'
import { FormikTextField } from 'formik-material-fields'
import { Button } from '@material-ui/core'
import { apiClient } from '../apiClient/apiClient'
//#endregion Imports

//#region Main function
const OrderAddEdit = ({ initValues, isEdit, closeModal }) => {
    //#region Form
    console.log(initValues)
    console.log(isEdit)
    console.log(closeModal)

    const initialValues = {
        clientName: initValues.client?.name + " " + initValues.client?.surname,
        bookTitle: initValues.book?.title,
        orderDate: new Date(),
        count: initValues.count ?? 0,
        cost: initValues.book?.cost ?? 0,
        total: initValues.count * initValues.book?.cost ?? 0
    }

    const validationSchema = Yup.object({
        clientName: Yup.string().required("Client is required!"),
        bookTitle: Yup.string().required("Book is required!"),
        count: Yup.number().moreThan(0, "The number of books must be greater than 0!").required("Count is required!"),
    })
    //#endregion Form

    //#region Submit form
    const submitForm = values => {
        if (isEdit) {
            apiClient.put(`/api/Orders/${initValues.orderId}`, { ...initValues, ...values })
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
                    // console.log(formik)
                    return (
                        <Form style={{ marginBottom: '16px', background: 'white', display: 'flex', flexDirection: 'column' }}>
                            <FormikTextField
                                type='text'
                                id='name'
                                name='name'
                                label='Name'
                                margin='normal'
                            />
                            <FormikTextField
                                type='text'
                                id='surname'
                                name='surname'
                                label='Surname'
                                margin='normal'
                            />
                            <FormikTextField
                                type='text'
                                id='adress'
                                name='adress'
                                label='Adress'
                                margin='normal'
                            />
                            <FormikTextField
                                type='text'
                                id='phoneNumber'
                                name='phoneNumber'
                                label='Phone number'
                                margin='normal'
                            />
                            <FormikTextField
                                type='text'
                                id='email'
                                name='email'
                                label='E-mail'
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