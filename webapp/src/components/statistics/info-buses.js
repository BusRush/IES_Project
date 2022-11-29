import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

 return (
  <Card {...props}>
    <CardHeader 
        action={(
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Status"
                    onChange={handleChange}
                >
                    <MenuItem status={"In Route"}>In Route</MenuItem>
                    <MenuItem status={"Stopped"}>Stopped</MenuItem>
                </Select>
                </FormControl>
            </Box>)}
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
                Name
              </TableCell>
              <TableCell>
                Time
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {busesLive.map((bus) => (
              <TableRow
                hover
                key={bus.id}
              >
                <TableCell>
                  {bus.name}
                </TableCell>
                <TableCell>
                  {bus.routeId}
                </TableCell>
                <TableCell>
                  {format(bus.metrics.timestamp, 'dd/MM/yyyy H:mma')}
                </TableCell>
                <TableCell>
                <SeverityPill
                    color={(bus.metrics.speed !== 0 && 'success')
                    || error}
                  >
                    {bus.metrics.speed !== 0 ? 'In Route' : 'Stopped'}
                  </SeverityPill>
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
