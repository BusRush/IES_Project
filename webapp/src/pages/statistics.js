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
      dataf : [],
      days: 7,
    };
  }

  getDays = (d) => {
    let days = [];

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let today = year + '-' + month + '-' + day;
    days.push(today);

    date.setDate(date.getDate() - (d-1));
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    let aday = year + '-' + month + '-' + day;
    days.push(aday);

    return days;
  };

  handleDays = (daystemp) => {
    this.updateDays(daystemp);
    this.getData(daystemp)
        .then(dataf => this.updateDataf(dataf));
  };

  componentDidMount = () => {
    this.fetchAllStops()
        .then(stops => this.updateStops(stops));
    this.fetchAllBuses()
        .then(buses => this.updateBuses(buses));
    this.fetchAllDrivers()
        .then(drivers => this.updateDrivers(drivers));
    this.getData(7)
        .then(dataf => this.updateDataf(dataf));
  };

  fetchAllStops = async () => {
    let stops = null;
    await fetch('http://localhost:8080/api/stops')
      .then(res => res.json())
      .then(data => stops = data)
      .catch(err => console.log(err))
    ;
    console.log(stops)
    return stops;
  };

  fetchAllBuses = async () => {
    let buses = null;
    await fetch('http://localhost:8080/api/buses')
      .then(res => res.json())
      .then(data => buses = data)
      .catch(err => console.log(err))
    ;
    console.log(buses)
    return buses;
  };

  fetchAllDrivers = async () => {
    let drivers = null;
    await fetch('http://localhost:8080/api/drivers')
      .then(res => res.json())
      .then(data => drivers = data)
      .catch(err => console.log(err))
    ;
    console.log(drivers)
    return drivers;
  };

  getData = async (d) => {
    let dataf = null;
    let days = this.getDays(d);
    await fetch('http://localhost:8080/api/stats/day/delays?from=' + days[1] + '&to=' + days[0])
      .then(res => res.json())
      .then(data => dataf = data)
      .catch(err => console.log(err))
    ;
    console.log(dataf)
    return dataf;
  };

  updateDays = (days) => {
    this.setState({ days: days });
  };

  updateDataf = (dataf) => {
    this.setState({ dataf: dataf });
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
                <StatsBus
                  dataf={this.state.dataf}
                  onDaysChange={this.handleDays}
                 />
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