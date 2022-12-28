import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { BusTable } from "../components/topology/bus-topology-table";
import { DeviceTable } from "../components/topology/device-topology-table";
import { DriverTable } from "../components/topology/drivers-topology-table";
import { RouteTable } from "../components/topology/routes-topology-table";
import { ScheduleTable } from "../components/topology/schedules-topology-table";
import { StopTable } from "../components/topology/stops-topology-table";

const Page = () => {
  const [buses, setBuses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stops, setStops] = useState([]);
  const [busesIsLoading, setBusesIsLoading] = useState(true);
  const [devicesIsLoading, setDevicesIsLoading] = useState(true);
  const [driversIsLoading, setDriversIsLoading] = useState(true);
  const [routesIsLoading, setRoutesIsLoading] = useState(true);
  const [schedulesIsLoading, setSchedulesIsLoading] = useState(true);
  const [stopsIsLoading, setStopsIsLoading] = useState(true);

  useEffect(() => {
    fetchAllBuses().then((buses) => setBuses(buses));
    fetchAllDevices().then((devices) => setDevices(devices));
    fetchAllDrivers().then((drivers) => setDrivers(drivers));
    fetchAllRoutes().then((routes) => setRoutes(routes));
    fetchAllSchedules().then((schedules) => setSchedules(schedules));
    fetchAllStops().then((stops) => setStops(stops));
  }, [buses, devices, drivers, routes, schedules]);

  const fetchAllBuses = async () => {
    let buses = null;
    await fetch("http://localhost:8080/api/buses")
      .then((res) => res.json())
      .then((data) => (buses = data))
      .catch((err) => console.log(err));
    setBusesIsLoading(false);
    return buses;
  };

  const fetchAllDevices = async () => {
    let devices = null;
    await fetch("http://localhost:8080/api/devices")
      .then((res) => res.json())
      .then((data) => (devices = data))
      .catch((err) => console.log(err));
    setDevicesIsLoading(false);
    return devices;
  };

  const fetchAllDrivers = async () => {
    let drivers = null;
    await fetch("http://localhost:8080/api/drivers")
      .then((res) => res.json())
      .then((data) => (drivers = data))
      .catch((err) => console.log(err));
    setDriversIsLoading(false);
    return drivers;
  };

  const fetchAllRoutes = async () => {
    let routes = null;
    await fetch("http://localhost:8080/api/routes")
      .then((res) => res.json())
      .then((data) => (routes = data))
      .catch((err) => console.log(err));
    setRoutesIsLoading(false);
    return routes;
  };

  const fetchAllSchedules = async () => {
    let schedules = null;
    await fetch("http://localhost:8080/api/schedules")
      .then((res) => res.json())
      .then((data) => (schedules = data))
      .catch((err) => console.log(err));
    setSchedulesIsLoading(false);
    return schedules;
  };

  const fetchAllStops = async () => {
    let stops = null;
    await fetch("http://localhost:8080/api/stops")
      .then((res) => res.json())
      .then((data) => (stops = data))
      .catch((err) => console.log(err));
    setStopsIsLoading(false);
    return stops;
  };

  return (
    <>
      <Head>
        <title>BusRush - Topology</title>
      </Head>
      {busesIsLoading ||
      devicesIsLoading ||
      driversIsLoading ||
      routesIsLoading ||
      schedulesIsLoading ||
      stopsIsLoading ? (
        <CircularProgress />
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <Typography
              color="textPrimary"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Topology
            </Typography>

            <Grid container>
              <Grid item xs={12} md={6} lg={6}>
                <BusTable buses={buses} devices={devices} routes={routes} />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <DeviceTable devices={devices} buses={buses} />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <DriverTable drivers={drivers} routes={routes} />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <RouteTable routes={routes} buses={buses} drivers={drivers} />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <ScheduleTable schedules={schedules} routes={routes} stops={stops} />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <StopTable stops={stops} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
