import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { TotalBuses } from '../components/statistics/total-buses';
import { TotalStops} from '../components/statistics/total-stops';
import { StatsBus } from '../components/statistics/status-buses';
import { InfoBuses} from '../components/statistics/info-buses';

const Page = () => (
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
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            xl={8}
          >
            <TotalBuses/>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            xl={8}
          >
            <TotalStops />
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
            <InfoBuses />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;