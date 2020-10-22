import React, {useState, useEffect} from 'react';
import {
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    TableCell,
    TableBody,
    TablePagination,
    TextField,
    Checkbox
} from "@material-ui/core";
import httpAgent from "../util/httpAgent";
import {makeStyles} from "@material-ui/core/styles";
import PurchaseRequestCompletedCheckbox from "./purchaseRequestCompletedCheckbox";
import {useAuth} from "../context/auth-context"

const columns = [
    {id: 'SKU', label: 'SKU', minWidth: 100},
    {id: 'quantity', label: 'Quantity', minWidth: 170,},
    {id: 'unitPrice', label: 'Unit Price', minWidth: 170,},
    {id: 'completed', label: 'Completed', minWidth: 170,},
];


const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 800,
    },
});

export default function PurchaseRequest() {
    const classes = useStyles();
    const {authData} = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState('');
    const [purchases, setPurchases] = useState('');
    const [completed, setCompleted] = useState(false);

    const getData = async () => {
        const response = await httpAgent.get('/purchases', {},
            {Authorization: `Bearer ${authData.token}`});
        setRows(response);
        setPurchases(response)
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const search = (value) => {
        setQuery(value)
        const filterdData = purchases.filter((row) => {
            if (row.SKU.toLowerCase().includes(value)) {
                return row
            }
        })
        setRows(filterdData)
    }
    const filterNotCompleted = (value) => {
        setCompleted(value);
        if (!value) {
            setRows(purchases)

        } else {
            const filterdData = purchases.filter((row) => {
                if (value && !row.completed) {
                    return row
                }
            })
            setRows(filterdData)
        }
    }
    return (
        <Paper className={classes.root}>
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
                    checked={completed}
                    onChange={(e) => filterNotCompleted(e.target.checked)}
                    inputProps={{'aria-label': 'primary checkbox'}}
                    label="Not completed"
                />
            </div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                    <TableCell align="left">{row.SKU}</TableCell>
                                    <TableCell align="left">{row.quantity}</TableCell>
                                    <TableCell align="left">{row.unitPrice}</TableCell>
                                    <TableCell align="left">
                                        <PurchaseRequestCompletedCheckbox completed={row.completed} id={row._id}/>
                                    </TableCell>
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
    );
}