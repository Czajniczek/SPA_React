//#region Imports
import React from 'react'
import { Form, Formik, Field } from 'formik'
import * as Yup from 'yup'
import { apiClient } from '../apiClient/apiClient'
import { FormikTextField } from 'formik-material-fields'
import { Button } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { pl } from 'date-fns/locale'
import SaveIcon from '@material-ui/icons/Save'
//#endregion Imports

//#region Main function
const BookAddEdit = ({ initValues, isEdit, closeModal }) => {
    //#region Form
    const categories = ["Liryka", "Epika", "Dramat"]

    const initialValues = {
        title: initValues.title,
        author: initValues.author,
        category: initValues.category ?? categories[0],
        cost: initValues.cost ?? 0,
        publicationDate: initValues.publicationDate ?? new Date(),
        publisher: initValues.publisher,
        description: initValues.description,
    }

    const validationSchema = Yup.object({
        title: Yup.string().max(50, "The maximum length of the title is 50 characters!").required("Title is required!"),
        author: Yup.string().max(30, "The maximum length of the author is 30 characters!").required("Author is required!"),
        category: Yup.string().required("Category is required!"),
        cost: Yup.number().moreThan(0, "The cost of the book must be greater than 0!").required("Cost is required!"),
        publicationDate: Yup.date().required("Publication date is required!"),
        publisher: Yup.string().max(30, "The maximum length of the title is 30 characters!").required("Publisher is required!"),
        description: Yup.string().max(1000, "The maximum length of the title is 1000 characters!").required("Description is required!"),
    })
    //#endregion Form

    //#region Submit form
    const submitForm = values => {
        if (isEdit) {
            apiClient.put(`/api/Books/${initValues.bookId}`, { ...initValues, ...values })
                .then(resp => {
                    if (resp.status === 200) {
                        const { data } = resp
                        closeModal(data)
                    }
                })
        }
        else {
            apiClient.post('/api/Books', values)
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
                                id='title'
                                name='title'
                                label='Title'
                                margin='normal'
                            />
                            <FormikTextField
                                type='text'
                                id='author'
                                name='author'
                                label='Author'
                                margin='normal'
                            />
                            {/* <label htmlFor='category'>Category</label> */}
                            <Field
                                name='category'
                                id='category'
                                as='select'
                            >
                                {
                                    categories.map((elem, index) => {
                                        return (
                                            <option value={elem} key={index}>{elem}</option>
                                        )
                                    })
                                }
                            </Field>
                            <FormikTextField
                                type='number'
                                id='cost'
                                name='cost'
                                label='Cost'
                                margin='normal'
                            />
                            <MuiPickersUtilsProvider
                                locale={pl}
                                utils={DateFnsUtils}
                            >
                                <KeyboardDatePicker
                                    // name='publicationDate'
                                    value={formik.values.publicationDate}
                                    // views={['year', 'month', 'day']}
                                    onChange={(date) => formik.setFieldValue('publicationDate', date)}
                                    format='dd-MM-yyyy'
                                />
                            </MuiPickersUtilsProvider>
                            <FormikTextField
                                type='text'
                                id='publisher'
                                name='publisher'
                                label='Publisher'
                                margin='normal'
                            />
                            <Field
                                id='description'
                                name='description'
                                label='Description'
                                margin='normal'
                                component='textarea'
                                rows='15'
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

export default BookAddEdit