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
const ClientAddEdit = ({ initValues, isEdit, closeModal }) => {
    //#region Form
    const initialValues = {
        name: initValues.name,
        surname: initValues.surname,
        adress: initValues.adress,
        phoneNumber: initValues.phoneNumber,
        email: initValues.email
    }

    const validationSchema = Yup.object({
        name: Yup.string().max(20, "The maximum length of the title is 20 characters!").required("Name is required!"),
        surname: Yup.string().max(30, "The maximum length of the surname is 30 characters!").required("Surname is required!"),
        adress: Yup.string().max(30, "The maximum length of the adress is 20 characters!").required("Adress is required!"),
        phoneNumber: Yup.string().max(9, "The phone number must consist of 9 digits!").min(9, "The phone number must consist of 9 digits!").required("Phone number is required!"),
        email: Yup.string().max(30, "The maximum length of the e-mail is 20 characters!").required("E-mail is required!"),
    })
    //#endregion Form

    //#region Submit form
    const submitForm = values => {
        if (isEdit) {
            apiClient.put(`/api/Clients/${initValues.clientId}`, { ...initValues, ...values })
                .then(resp => {
                    if (resp.status === 200) {
                        // debugger;
                        const { data } = resp
                        closeModal(data)
                    }
                })
        }
        else {
            apiClient.post('/api/Clients', values)
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

export default ClientAddEdit