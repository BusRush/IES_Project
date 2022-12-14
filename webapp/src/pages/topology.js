import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { BusListResults } from '../components/topology/bus-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';

const Page = () => {

    const [buses, setBuses] = useState([]);

    useEffect(() => {
      fetchAllBuses()
        .then(buses => setBuses(buses));
    }, [buses]);

    const fetchAllBuses = async () => {
      let buses = null;
      await fetch('http://localhost:8080/api/buses')
        .then(res => res.json())
        .then(data => buses = data)
        .catch(err => console.log(err))
      ;
      return buses;
    };

    return (<>
      <Head>
        <title>
          Customers | Material Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar/>
          <Box sx={{ mt: 3 }}>
            <BusListResults buses={buses}/>
          </Box>
        </Container>
      </Box>
    </>);
  }
;

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
