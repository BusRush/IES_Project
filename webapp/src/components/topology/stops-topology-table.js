import {
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Grid,
  IconButton,
  TablePagination,
  TableFooter,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

export const StopTable = ({ stops, ...rest }) => {
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    if (limit > event.target.value) {
      handlePageChange(event, page, -1, limit - event.target.value);
    } else if (limit < event.target.value) {
      handlePageChange(event, page, 1, event.target.value - limit);
    }

    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage, flag = 0, new_lim = 0) => {
    if (newPage > page) {
      setLowerBound(lower_bound + limit);
      setUpperBound(upper_bound + limit);
    } else if (newPage < page) {
      setLowerBound(lower_bound - limit);
      setUpperBound(upper_bound - limit);
    } else {
      if (flag == 1) {
        console.log("flag 1");
        console.log("new_lim: " + new_lim);
        setUpperBound(upper_bound + new_lim);
      } else if (flag == -1) {
        setUpperBound(upper_bound - new_lim);
      }
    }
    setPage(newPage);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={10} lg={10}>
              <Typography
                color="black"
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  margin: 0,
                }}
              >
                Stops
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <IconButton>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Designation</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stops.slice(lower_bound, upper_bound).map((stop) => (
                <TableRow hover key={stop.id}>
                  <TableCell align="left">{stop.id}</TableCell>
                  <TableCell align="left">{stop.designation}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </CardContent>
        <TablePagination
          component="div"
          count={stops.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Card>
    </Box>
  );
};
