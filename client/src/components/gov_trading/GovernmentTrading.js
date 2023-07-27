import { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const API = "https://financialmodelingprep.com/api/v4/"

const columns = [
    {id: 'transactionDate', label: 'Transaction Date', minWidth: 170},
    {id: 'assetTraded', label: 'Asset Traded', minWidth: 170},
    {id: 'transactionType', label: 'Transaction Type', minWidth: 170},
    {id: 'amount', label: 'Amount', minWidth: 170},
    {id: 'representative', label: 'Rep. Name', minWidth: 170},
    {id: 'district', label: 'District', minWidth: 170},
]

function createData(transactionDate, assetTraded, transactionType, amount, representative, district) {
    return {transactionDate, assetTraded, transactionType, amount, representative, district};
}

function GovernmentTrading() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    

    useEffect(() => {
        fetch(`${API}senate-disclosure-rss-feed?page=0&apikey=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then((r) => {
            // console.log(r)
            const newRows = r.map((transaction) => {
                return createData(
                    transaction.transactionDate,
                    transaction.assetDescription,
                    transaction.type,
                    transaction.amount,
                    transaction.representative,
                    transaction.district
                );
            })
            setRows(newRows);
            setIsLoading(false);
        })
    },[])
    
    return (
        <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{width:"75%"}}>
                <div style={{width:"50%", marginTop:"50px", marginBottom:"50px"}}>
                    <a className='gov-trading-link' href="https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.htm" target="_blank">The Stop Trading on Congressional Knowledge Act (Stock Act)</a>
                    <p className='gov-trading-text'>Represenatives must report transactions over $1000 involving stocks, bonds, and commodities to
                        the Ethics Office on an ongoing basis. Transactions must be reported within 45 days of execution. <strong>Bellow is a collection of recent dislosures by members of congress.</strong></p>
                </div>
                <div className="transaction-title">Transaction Discolsures</div>
                <div style={{marginBottom: "50px"}}>
                    {rows.length > 0 && (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 840 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth, fontWeight:"bolder" }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow key={row.code} hover role="checkbox" tabIndex={-1}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[20, 50, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    )}
                </div>
            </div>
        </div>
    )
}
export default GovernmentTrading;