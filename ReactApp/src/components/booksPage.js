import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { makeStyles, withStyles } from '@material-ui/styles'
import { apiClient } from "../apiClient/apiClient"
import { DataGrid, isOverflown } from '@material-ui/data-grid'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Style.css'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router'

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

const StyledButton = withStyles({
    root: {
        '&:hover': {
            backgroundColor: 'red'
        }
    }
})(Button)

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

const BooksPage = () => {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState([])
    const history = useHistory()

    useEffect(() => {
        apiClient.get("/api/Books")
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

    const getRowButton = ({ value }) => {
        return (
            <div style={{ display: 'flex', flexShrink: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <StyledButton onClick={() => handleEdit(value)}>
                    EDIT
                </StyledButton>
                <StyledButton onClick={() => handleDelete(value)}>
                    DELETE
                </StyledButton>
            </div>
        )
    }

    const handleEdit = (value) => {
        // debugger;
        var book = values.filter(x => x.bookId === value);

        history.push('/BookEdit', { book })
    }

    const handleDelete = (value) => {
        apiClient.delete(`/api/Books/${value}`)
            .then(resp => {
                if (resp.status === 204) {
                    //Wywalenie z tablicy książek
                    const index = values.findIndex(x => x.bookId === value)
                    if (index != -1) {
                        setValues(prev => {
                            let local = prev
                            local.splice(index, 1)
                            return [...local]
                        })
                    }
                }
            })
    }

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
        { field: 'description', headerName: 'Description', width: 300, type: 'string', headerAlign: 'center', align: 'center', renderCell: renderCellExpand },
        { field: 'id', disableClickEventBubbling: true, headerName: 'Actions', width: 200, headerAlign: 'center', renderCell: (params) => getRowButton(params) }
    ];

    for (let book of values) {
        book.publicationDate = book.publicationDate.slice(0, 4)
    }

    const rows = values.map((book) => ({
        id: book.bookId,
        author: book.author,
        title: book.title,
        category: book.category,
        cost: book.cost,
        publicationDate: book.publicationDate,
        publisher: book.publisher,
        description: book.description,
    }))

    return (
        <div style={{ height: 300, width: 'auto', margin: 20 }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight />
        </div>
    )
}

export default BooksPage