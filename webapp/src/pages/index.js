import Head from "next/head";
import { Box, Button, Container, Grid, List, ListItem, Modal } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import Stomp from "stompjs";
import { useEffect, useState } from "react";

const Page = () => {
  const [delayed_buses, setDelayedBuses] = useState(new Map());
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addDelayedBus = (bus) => {
    const newMap = new Map(delayed_buses);
    newMap.set(bus.bus_id, bus.delay);
    console.log(newMap);
    setDelayedBuses(newMap);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const stomp = Stomp.client("ws://localhost:15674/ws");
    const headers = {
      login: "guest",
      passcode: "guest",
      durable: true,
      "auto-delete": false,
    };
    stomp.connect(
      headers,
      () => {
        stomp.subscribe("/queue/events", (msg) => {
          const data = JSON.parse(msg.body);
          addDelayedBus(data);
          //addFoo({ bus: data.bus_id, delay: data.delay });
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Button onClick={handleOpen}>Open Modal</Button>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style(viewportWidth)}>
          <h2 id="transition-modal-title">Delayed Buses</h2>
          <p>Bus - Delay</p>
          <List>
            {Array.from(delayed_buses).map(([bus, delay]) => (
              <ListItem key={bus}>
                {bus} - {delay}
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

const style = (viewportWidth) => ({
  position: "absolute",
  top: "50%",
  left: viewportWidth > 1200 ? "60%" : "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid grey",
  borderRadius: 1,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  justifyContent: "center",
  alignItems: "center",
});
