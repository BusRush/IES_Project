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
  const [delayed_buses, setDelayedBuses] = useState(new Set());
  const [open, setOpen] = useState(false);

  const addFoo = (foo) => {
    setDelayedBuses((prev) => new Set(prev.add(foo)));
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
          addFoo(data.bus_id);
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
        <Box sx={{ width: 400, height: 400, bgcolor: "background.paper" }}>
          <List>
            {Array.from(delayed_buses).map((bus) => (
              <ListItem key={bus}>{bus}</ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
