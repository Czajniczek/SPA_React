//#region Imports
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { makeStyles } from '@material-ui/styles'
import { apiClient } from "../apiClient/apiClient"
import { DataGrid, isOverflown } from '@material-ui/data-grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import BookAddEdit from "./bookAddEdit"
import { format } from 'date-fns'
//#endregion Imports

//#region Styles
// const StyledButton = withStyles({
//     root: {
//         '&:hover': {
//             backgroundColor: 'red'
//         }
//     }
// })(Button)

// const useStyles = makeStyles(() => ({
//     root: {
//         '&.MuiTypography-h6': {
//             fontWeight: 'bold',
//             textAlign: 'center'
//         }
//     }
// }))
//#endregion Styles

//#region Expand cell renderer
const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        '& .cellValue': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
}))

const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    return (
        <div
            ref={wrapper}
            className={classes.root}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cellDiv}
                style={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <div ref={cellValue} className="cellValue">
                {value}
            </div>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                    >
                        <Typography variant="body2" style={{ padding: 8 }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </div>
    );
});

GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
    return (
        <GridCellExpand
            value={params.value ? params.value.toString() : ''}
            width={params.colDef.width}
        />
    );
}

renderCellExpand.propTypes = {
    colDef: PropTypes.any.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
        PropTypes.object,
        PropTypes.string,
        PropTypes.bool,
    ]),
};
//#endregion Expand cell renderer

//#region Main function
const BooksPage = () => {
    //#region Hooks
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [edited, setEdited] = useState({})
    //#endregion Hooks

    //#region Load data from API
    useEffect(() => {
        apiClient.get("/api/Books")
            .then(resp => {
                const { data } = resp
                setValues(data)
                setLoading(true)
            })
            .catch(err => console.log(err))
    }, [])

    if (!loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '200px' }}>
                <CircularProgress style={{ height: 80, width: 80 }} />
                <h3>Loading books data ...</h3>
            </div>
        )
    }
    //#endregion Load data from API

    //#region Create columns and rows for table
    const columns = [
        // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'title', headerName: 'Title', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'author', headerName: 'Author', width: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: 'Category', width: 140, type: 'string', headerAlign: 'center', align: 'center' },
        {
            field: 'cost', headerName: 'Cost', width: 110, type: 'number', headerAlign: 'center', align: 'center',
            valueFormatter: (params) => {
                const valueFormatted = Number(params.value).toLocaleString();
                return `${valueFormatted} zł`
            }
        },
        { field: 'publicationDate', headerName: 'Publication', width: 150, type: 'date', headerAlign: 'center', align: 'center' },
        { field: 'publisher', headerName: 'Publisher', width: 140, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'description', headerName: 'Description', width: 250, type: 'string', headerAlign: 'center', align: 'center', renderCell: renderCellExpand },
        { field: 'id', headerName: 'Action', width: 130, headerAlign: 'center', align: 'center', disableClickEventBubbling: true, renderCell: (params) => getRowButton(params) }
    ]

    const rows = values.map((book) => ({
        id: book.bookId,
        author: book.author,
        title: book.title,
        category: book.category,
        cost: book.cost,
        publicationDate: format(new Date(book.publicationDate), 'dd-MM-yyyy'),
        publisher: book.publisher,
        description: book.description,
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

    const handleAddBookModal = (values) => {
        setShowModal(false)
        setValues(prev => {
            return [...prev, values]
        })
    }

    const handleEdit = (value) => {
        var book = values.filter(x => x.bookId === value);
        setEdited(book[0])
        setIsEdit(true)
        setShowModal(true)
    }

    const handleEditBookModal = (values) => {
        setShowModal(false)
        setValues(prev => {
            let local = prev
            let index = local.findIndex(x => x.bookId === values.bookId)

            if (index !== -1) {
                local.splice(index, 1, values)
                return [...local]
            }

            return [...local]
        })
    }

    const handleDelete = (value) => {
        apiClient.delete(`/api/Books/${value}`)
            .then(resp => {
                if (resp.status === 204) {
                    const index = values.findIndex(x => x.bookId === value)
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
                maxWidth='sm'
                fullWidth={true}
                onBackdropClick={() => setShowModal(false)}
                onEscapeKeyDown={() => setShowModal(false)}
            >
                <DialogTitle>
                    {isEdit ? "EDIT BOOK" : "ADD BOOK"}
                </DialogTitle>
                <DialogContent>
                    <BookAddEdit
                        initValues={edited}
                        isEdit={isEdit}
                        closeModal={isEdit ? handleEditBookModal : handleAddBookModal}
                    />
                </DialogContent>
            </Dialog>
            <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
            <Fab color="primary" aria-label="Add book" onClick={handleAdd} style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
                <AddIcon />
            </Fab>
        </div>
    )
}
//#endregion Main function

export default BooksPage