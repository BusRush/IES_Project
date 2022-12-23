import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import * as React from 'react';
import {useEffect, useState} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';
import { busesLive } from '../../__mocks__/buses-live';

export const InfoBuses = (props) => {
    const [status, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const { buses } = props;    

 return (
  <Card {...props}>
    <CardHeader
        title="Info Buses" />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
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
                Device ID
              </TableCell>
              <TableCell>
                Route ID
              </TableCell>
        </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(buses).map((bus) => (
              <TableRow
                hover
                key={bus[1].id}
              >
                <TableCell>
                  {bus[1].id}
                </TableCell>
                <TableCell>
                  {bus[1].registration}
                </TableCell>
                <TableCell>
                  {bus[1].deviceId}
                </TableCell>
                <TableCell>
                  {bus[1].routesId.length > 0 ? bus[1].routesId[0].id : "No route"}
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