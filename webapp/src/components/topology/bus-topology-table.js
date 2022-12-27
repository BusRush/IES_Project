import {
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Grid,
  IconButton,
  TablePagination,
  Modal,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";

export const BusTable = ({ buses, devices, routes, ...rest }) => {
  // use states
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddBusModal, setOpenAddBusModel] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [busID, setBusID] = useState("");
  const [busIDIsValid, setBusIDIsValid] = useState(true);
  const [busIDInputHelpText, setBusIDInputHelpText] = useState("");
  const [busRegistration, setBusRegistration] = useState("");
  const [busRegistrationIsValid, setBusRegistrationIsValid] = useState(true);
  const [busRegistrationInputHelpText, setBusRegistrationInputHelpText] = useState("");
  const [busBrand, setBusBrand] = useState("");
  const [busBrandIsValid, setBusBrandIsValid] = useState(true);
  const [busModel, setBusModel] = useState("");
  const [busModelIsValid, setBusModelIsValid] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  // functions
  const handleLimitChange = (event) => {
    if (limit > event.target.value) {
      handlePageChange(event, page, -1, limit - event.target.value);
    } else if (limit < event.target.value) {
      handlePageChange(event, page, 1, event.target.value - limit);
    }

    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage, flag = 0, new_lim = 0) => {
    if (newPage > page) {
      setLowerBound(lower_bound + limit);
      setUpperBound(upper_bound + limit);
    } else if (newPage < page) {
      setLowerBound(lower_bound - limit);
      setUpperBound(upper_bound - limit);
    } else {
      if (flag == 1) {
        console.log("flag 1");
        console.log("new_lim: " + new_lim);
        setUpperBound(upper_bound + new_lim);
      } else if (flag == -1) {
        setUpperBound(upper_bound - new_lim);
      }
    }
    setPage(newPage);
  };

  // Bus ID Input Handle Function and Validation
  const validateBusIDInput = (busID) => {
    let pattern = /^AVRBUS-B[0-9]{4}$/;
    let busId_is_valid = false;
    if (pattern.test(busID)) {
      busId_is_valid = true;

      buses.forEach((bus) => {
        if (bus.id == busID) {
          busId_is_valid = false;
          setBusIDInputHelpText("Bus ID already exists");
        }
      });
    } else {
      busId_is_valid = false;
      setBusIDInputHelpText("Should be in the form of AVRBUS-BXXXX");
    }
    return busId_is_valid;
  };

  const handleBusIDInputChange = (event) => {
    let val = validateBusIDInput(event.target.value);
    setBusIDIsValid(val);
    if (val) {
      setBusID(event.target.value);
    }
  };

  const handleBusIDInputFocus = (event) => {
    setBusIDIsValid(validateBusIDInput(event.target.value));
  };

  const handleBusIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusIDIsValid(true);
      setBusIDInputHelpText("");
    }
  };

  // Bus Registration Input Handle Function and Validation
  const validateBusRegistrationInput = (busRegistration) => {
    let pattern = /^[0-9]{2}-[A-Z]{2}-[0-9]{2}$/;
    let busRegistration_is_valid = false;
    if (pattern.test(busRegistration)) {
      busRegistration_is_valid = true;
    } else {
      busRegistration_is_valid = false;
      setBusRegistrationInputHelpText(
        "Should be in the form of XX-YY-XX (X: digit, Y: capital letter)"
      );
    }
    return busRegistration_is_valid;
  };
  const handleBusRegistrationInputChange = (event) => {
    let val = validateBusRegistrationInput(event.target.value);
    setBusRegistrationIsValid(val);
    if (val) {
      setBusRegistration(event.target.value);
    }
  };

  const handleBusRegistrationInputFocus = (event) => {
    setBusRegistrationIsValid(validateBusRegistrationInput(event.target.value));
  };

  const handleBusRegistrationInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusRegistrationIsValid(true);
      setBusRegistrationInputHelpText("");
    }
  };

  // Bus Brand Input Handle Function and Validation
  const validateBusBrandInput = (busBrand) => {
    if (busBrand == "") {
      return false;
    }
    return true;
  };

  const handleBusBrandInputChange = (event) => {
    let val = validateBusBrandInput(event.target.value);
    setBusBrandIsValid(val);
    if (val) {
      setBusBrand(event.target.value);
    }
  };

  const handleBusBrandInputFocus = (event) => {
    setBusBrandIsValid(validateBusBrandInput(event.target.value));
  };

  const handleBusBrandInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusBrandIsValid(true);
    }
  };

  // Bus Model Input Handle Function and Validation
  const validateBusModelInput = (busModel) => {
    if (busModel == "") {
      return false;
    }
    return true;
  };

  const handleBusModelInputChange = (event) => {
    let val = validateBusModelInput(event.target.value);
    setBusModelIsValid(val);
    if (val) {
      setBusModel(event.target.value);
    }
  };

  const handleBusModelInputFocus = (event) => {
    setBusModelIsValid(validateBusModelInput(event.target.value));
  };

  const handleBusModelInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusModelIsValid(true);
    }
  };

  // Device Selection
  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  // Routes Selection
  const handleRoutesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRoutes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Add Bus
  const handleAddBus = () => {
    let routesID = [];
    selectedRoutes.forEach((route) => {
      let content = route.split("|");
      routesID.push({ id: content[0], shift: content[1] });
    });
    console.log(routesID);

    let newBus = {
      id: busID,
      registration: busRegistration,
      brand: busBrand,
      model: busModel,
      deviceId: selectedDevice,
      routesId: routesID,
    };

    fetch("http://localhost:8080/api/buses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBus),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    handleCloseAddBusModal();
  };
  // Add Bus Modal Handle Functions
  const handleOpenAddBusModal = () => {
    setOpenAddBusModel(true);
  };

  const handleCloseAddBusModal = () => {
    setOpenAddBusModel(false);
    setBusID("");
    setBusIDIsValid(true);
    setBusIDInputHelpText("");
    setBusRegistration("");
    setBusRegistrationIsValid(true);
    setBusRegistrationInputHelpText("");
    setBusBrand("");
    setBusBrandIsValid(true);
    setBusModel("");
    setBusModelIsValid(true);
    setSelectedDevice("");
    setSelectedRoutes([]);
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addBus = () => {};

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={10} lg={10}>
              <Typography
                color="black"
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  margin: 0,
                }}
              >
                Buses
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <IconButton onClick={handleOpenAddBusModal}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Registration</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.slice(lower_bound, upper_bound).map((bus) => (
                <TableRow hover key={bus.id}>
                  <TableCell align="left">{bus.id}</TableCell>
                  <TableCell align="left">{bus.registration}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={handleDeleteBus(bus.id)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <TablePagination
          component="div"
          count={buses.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Card>
      <Modal
        open={openAddBusModal}
        onClose={handleCloseAddBusModal}
        aria-labelledby="add-bus-modal"
        aria-describedby="add-bus-modal"
      >
        <Box sx={style(viewportWidth)}>
          <Typography id="add-bus-modal" variant="h6" component="h2" sx={{ paddingBottom: 2 }}>
            Add Bus
          </Typography>
          <Box>
            <FormControl>
              <InputLabel htmlFor="bus-id">Bus ID</InputLabel>
              <Input
                onFocus={handleBusIDInputFocus}
                onBlur={handleBusIDInputBlur}
                error={!busIDIsValid}
                id="bus-id"
                aria-describedby="bus-id"
                onChange={handleBusIDInputChange}
              />
              <FormHelperText id="bus-id">{busIDInputHelpText}</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <InputLabel htmlFor="bus-registration">Registration</InputLabel>
              <Input
                onFocus={handleBusRegistrationInputFocus}
                onBlur={handleBusRegistrationInputBlur}
                error={!busRegistrationIsValid}
                id="bus-registration"
                aria-describedby="bus-registration"
                onChange={handleBusRegistrationInputChange}
              />
              <FormHelperText id="bus-registration">{busRegistrationInputHelpText}</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <InputLabel htmlFor="bus-brand">Brand</InputLabel>
              <Input
                onFocus={handleBusBrandInputFocus}
                onBlur={handleBusBrandInputBlur}
                error={!busBrandIsValid}
                id="bus-brand"
                aria-describedby="bus-brand"
                onChange={handleBusBrandInputChange}
              />
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <InputLabel htmlFor="bus-model">Model</InputLabel>
              <Input
                onFocus={handleBusModelInputFocus}
                onBlur={handleBusModelInputBlur}
                error={!busModelIsValid}
                id="bus-model"
                aria-describedby="bus-model"
                onChange={handleBusModelInputChange}
              />
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <InputLabel htmlFor="bus-device">Device</InputLabel>
              <Select
                value={selectedDevice}
                onChange={handleDeviceChange}
                id="bus-device"
                aria-describedby="bus-device"
                sx={{ width: 200, marginTop: 1, height: 40 }}
              >
                {devices.map((device) =>
                  device.busId == null ? (
                    <MenuItem key={device.id} value={device.id}>
                      {device.id}
                    </MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <InputLabel htmlFor="bus-routes">Routes</InputLabel>
              <Select
                multiple={true}
                value={selectedRoutes}
                onChange={handleRoutesChange}
                id="bus-routes"
                aria-describedby="bus-routes"
                sx={{ width: 200, marginTop: 1, height: 40 }}
                MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
              >
                {routes.map((route) =>
                  route.busId == null ? (
                    <MenuItem
                      key={route.id.id + "|" + route.id.shift}
                      value={route.id.id + "|" + route.id.shit}
                    >
                      {route.id.id} | {route.id.shift}
                    </MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <FormControl>
              <Button
                variant="contained"
                onClick={handleAddBus}
                disabled={
                  busIDIsValid &&
                  busRegistrationIsValid &&
                  busBrandIsValid &&
                  busModelIsValid &&
                  selectedDevice != ""
                    ? false
                    : true
                }
              >
                Add Bus
              </Button>
            </FormControl>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

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
