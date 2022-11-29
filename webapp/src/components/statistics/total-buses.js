import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { busesLive } from '../../__mocks__/buses-live';

export const TotalBuses = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            TOTAL BUSES
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {busesLive.length}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <DirectionsBusIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);