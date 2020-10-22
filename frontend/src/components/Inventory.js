import React, {useState, useEffect} from 'react';
import {
    Paper,
    TableContainer,
    TableHead,
    Table,
    Button,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Modal,
    TextField,
    Checkbox
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import {CSVLink} from 'react-csv';
import httpAgent from "../util/httpAgent";
import QuantityInput from "./QuantityInput";
import PurchaseRequestForm from './PurchaseRequestForm';
import {useAuth} from "../context/auth-context"
import {isRole} from "../util/functions"

const columns = [
    {id: 'product', label: 'Product Name', minWidth: 120},
    {id: 'SKU', label: 'SKU', minWidth: 100},
    {id: 'quantity', label: 'Quantity', minWidth: 100,},
    {id: 'actions', label: 'Purchase Request', minWidth: 100,},
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        heigt: '100%'
    },
    container: {
        maxHeight: 700,
    },
    report: {
        float: 'right',
        padding: 10
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '35%',
        left: '35%'
    }
}));

const quantityField = (userRole, row) => {
    if (isRole(['Sales'], userRole)) {
        return (<QuantityInput quantity={row.quantity} SKU={row.SKU}/>)
    } else
        return (row.quantity)
}
const displyPurchaseButton = (userRole, column) => {
    if (!isRole(['Sales'], userRole) && column.id === 'actions') {
        return {display: 'none'}
    } else
        return {}

}

export default function Inventory() {
    const classes = useStyles();
    const {authData} = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState('');
    const [query, setQuery] = useState('');
    const [stock, setStock] = useState(false);
    const [inventory, setInventory] = useState([]);
    const getData = async () => {
        const response = await httpAgent.get('/inventory', {},
            {Authorization: `Bearer ${authData.token}`});
        setRows(response);
        setInventory(response)
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);
    const handleOpen = (row) => {
        setItem(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const createPurchaseRequest = async (SKU, quntity, unitPrice) => {
        const response = await httpAgent.post(`/purchases/`, {
                SKU,
                quantity: parseInt(quntity),
                unitPrice: parseInt(unitPrice)
            },
            {Authorization: `Bearer ${authData.token}`});
        handleClose()
        return response
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const search = (value) => {
        setQuery(value)
        const filterdData = inventory.filter((row) => {
            if (row.product.toLowerCase().includes(value) || row.SKU.toLowerCase().includes(value)) {
                return row
            }
        })
        setRows(filterdData)
    }
    const filterStock = (value) => {
        setStock(value);
        if (!value) {
            setRows(inventory)
        } else {
            const filterdData = inventory.filter((row) => {
                if (value && row.quantity < 1) {
                    return row
                }
            })
            setRows(filterdData)

        }
    }
    return (
        <div>
            <Paper className={classes.root}>
                {isRole(['Logistic'], authData.user.role) && (
                    <div className={classes.report}>
                        <CSVLink data={rows} filename={`${new Date().toDateString()}.csv`}>
                            <SaveAltIcon color="action"/>
                        </CSVLink>
                    </div>
                )}
                <div>
                    <TextField
                        name="search"
                        size="small"
                        label="Search"
                        variant="outlined"
                        value={query}
                        onChange={(e) => search(e.target.value)}
                        style={{width: '170px'}}
                    />
                    <Checkbox
                        checked={stock}
                        onChange={(e) => filterStock(e.target.checked)}
                        inputProps={{'aria-label': 'primary checkbox'}}
                        label="Not in Stock"
                    />
                </div>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{minWidth: column.minWidth}}
                                        style={displyPurchaseButton(authData.user.role, column)}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.SKU}>
                                        <TableCell align="left">{row.product}</TableCell>
                                        <TableCell align="left">{row.SKU}</TableCell>
                                        <TableCell align="left">
                                            {quantityField(authData.user.role, row)}
                                        </TableCell>
                                        {isRole(['Sales'], authData.user.role) && (
                                            <TableCell align="left">
                                                <Button aria-label="cratePurchaseRequest"
                                                        onClick={() => handleOpen(row)}>
                                                    <PostAddIcon/>
                                                </Button>
                                            </TableCell>)}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={classes.modal}>
                    <PurchaseRequestForm data={item} onSubmit={createPurchaseRequest}/>
                </div>
            </Modal>
        </div>
    );
}