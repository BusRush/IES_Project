import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

export const BusListResults = ({ buses, ...rest }) => {
  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Registration
                </TableCell>
                <TableCell>
                  Brand
                </TableCell>
                <TableCell>
                  Model
                </TableCell>
                <TableCell>
                  Device ID
                </TableCell>
                <TableCell>
                  Route IDs
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map(bus => (
                <TableRow
                  hover
                  key={bus.id}
                >
                  <TableCell>
                    {bus.id}
                  </TableCell>
                  <TableCell>
                    {bus.registration}
                  </TableCell>
                  <TableCell>
                    {bus.brand}
                  </TableCell>
                  <TableCell>
                    {bus.model}
                  </TableCell>
                  <TableCell>
                    {bus.deviceId}
                  </TableCell>
                  <TableCell>
                    {bus.routesId.map(routeId => routeId.id + "-" + routeId.shift).join(', ')}
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};
