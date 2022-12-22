import Head from 'next/head';
import { Component } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { TotalBuses } from '../components/statistics/total-buses';
import { TotalStops} from '../components/statistics/total-stops';
import { TotalDrivers} from '../components/statistics/total-drivers';
import { StatsBus } from '../components/statistics/status-buses';
import { InfoBuses} from '../components/statistics/info-buses';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buses: {},
      stops: [],
      drivers: [],
    };
  }

  componentDidMount = () => {
    this.fetchAllStops()
        .then(stops => this.updateStops(stops));
    this.fetchAllBuses()
        .then(buses => this.updateBuses(buses));
    this.fetchAllDrivers()
        .then(drivers => this.updateDrivers(drivers));
  };

  fetchAllStops = async () => {
    let stops = null;
    await fetch('http://localhost:8080/api/stops')
      .then(res => res.json())
      .then(data => stops = data)
      .catch(err => console.log(err))
    ;
    console.log(stops);
    return stops;
  };

  fetchAllBuses = async () => {
    let buses = null;
    await fetch('http://localhost:8080/api/buses')
      .then(res => res.json())
      .then(data => buses = data)
      .catch(err => console.log(err))
    ;
    console.log(buses);
    return buses;
  };

  fetchAllDrivers = async () => {
    let drivers = null;
    await fetch('http://localhost:8080/api/drivers')
      .then(res => res.json())
      .then(data => drivers = data)
      .catch(err => console.log(err))
    ;
    console.log(drivers);
    return drivers;
  };

  updateStops = (stops) => {
    this.setState({ stops: stops });
  };

  updateBuses = (buses) => {
    this.setState({ buses: buses });
  };

  updateDrivers = (drivers) => {
    this.setState({ drivers: drivers });
  };

  render = () => {
    const {buses, stops, drivers} = this.state;
    return (
      <>
        <Head>
          <title>
            Dashboard | Material Kit
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={12}
                lg={4}
                xl={8}
              >
                <TotalBuses
                  buses={buses}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={4}
                xl={8}
              >
                <TotalDrivers
                  drivers={drivers}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={4}
                xl={8}
              >
                <TotalStops
                  stops={stops}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={6}
                xl={8}
              >
                <StatsBus />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={6}
                xl={8}
              >
                <InfoBuses 
                  buses={buses}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    );
  };
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;