// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
import { Skeleton } from '@mui/joy';

const TableDataSkelaton = ({ colsNum = 1, rowsNum = 1, row_tailwindCSS = 'px-3 py-1'}) => {
    return [...Array(rowsNum)].map((row, row_i) => (
        <tr key={row_i}>
            {[...Array(colsNum)].map((col, col_i) => (
                <td key={col_i} className={row_tailwindCSS}>
                    <Skeleton animation="wave" variant="text" />
                </td>
            ))}
            {/* <td component="th" scope="row">
                <Skeleton animation="wave" variant="text" />
            </td>
            <td>
                <Skeleton animation="wave" variant="text" />
            </td>
            <td>
                <Skeleton animation="wave" variant="text" />
            </td>
            <td>
                <Skeleton animation="wave" variant="text" />
            </td> */}
        </tr>
    ));
}

export default TableDataSkelaton