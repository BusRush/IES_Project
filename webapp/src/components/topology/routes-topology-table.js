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
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export const RouteTable = ({ routes, drivers, buses, ...rest }) => {
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddRouteModal, setOpenAddRouteModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [routeID, setRouteID] = useState("");
  const [routeIDIsValid, setRouteIDIsValid] = useState(true);
  const [routeIDInputHelpText, setRouteIDInputHelpText] = useState("");
  const [routeShift, setRouteShift] = useState("");
  const [routeShiftIsValid, setRouteShiftIsValid] = useState(true);
  const [routeShiftInputHelpText, setRouteShiftInputHelpText] = useState("");
  const [routeDesignation, setRouteDesignation] = useState("");
  const [routeDesignationIsValid, setRouteDesignationIsValid] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedBus, setSelectedBus] = useState("");

  // pagination function handlers
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

  // Route ID Input Handle Function and Validation
  const validateRouteIDInput = (routeID) => {
    let pattern = /^AVRBUS-R[0-9]{4}$/;
    let routeId_is_valid = false;
    if (pattern.test(routeID)) {
      routeId_is_valid = true;
    } else {
      routeId_is_valid = false;
      setRouteIDInputHelpText("Should be in the form of AVRBUS-RXXXX");
    }
    return routeId_is_valid;
  };

  const handleRouteIDInputChange = (event) => {
    let val = validateRouteIDInput(event.target.value);
    setRouteIDIsValid(val);
    if (val) {
      setRouteID(event.target.value);
    }
  };

  const handleRouteIDInputFocus = (event) => {
    setRouteIDIsValid(validateRouteIDInput(event.target.value));
  };

  const handleRouteIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setRouteIDIsValid(true);
      setRouteIDInputHelpText("");
    } else {
      if (validateRouteIDInput(val)) {
        setRouteIDInputHelpText("");
      }
    }
  };

  // Route Shift Input Handle Function and Validation

  const validateRouteShiftInput = (routeShift) => {
    let pattern = /^([01]?[0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
    let routeShift_is_valid = false;
    if (pattern.test(routeShift)) {
      routeShift_is_valid = true;

      routes.forEach((route) => {
        if (route.id.id == routeID && route.id.shift == routeShift) {
          routeShift_is_valid = false;
          setRouteShiftInputHelpText("Route Shift already exists for given Route ID");
        }
      });
    } else {
      routeShift_is_valid = false;
      setRouteShiftInputHelpText("Should be in the form of HHMMSS");
    }
    return routeShift_is_valid;
  };

  const handleRouteShiftInputChange = (event) => {
    let val = validateRouteShiftInput(event.target.value);
    setRouteShiftIsValid(val);
    if (val) {
      setRouteShift(event.target.value);
    }
  };

  const handleRouteShiftInputFocus = (event) => {
    setRouteShiftIsValid(validateRouteShiftInput(event.target.value));
  };

  const handleRouteShiftInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setRouteShiftIsValid(true);
      setRouteShiftInputHelpText("");
    } else {
      if (validateRouteShiftInput(val)) {
        setRouteShiftInputHelpText("");
      }
    }
  };

  // Route Designation Input Handle Function and Validation
  const validateRouteDesignationInput = (routeDesignation) => {
    if (routeDesignation.length > 0) {
      return true;
    }
    return false;
  };

  const handleRouteDesignationInputChange = (event) => {
    let val = validateRouteDesignationInput(event.target.value);
    setRouteDesignationIsValid(val);
    if (val) {
      setRouteDesignation(event.target.value);
    }
  };

  const handleRouteDesignationInputFocus = (event) => {
    setRouteDesignationIsValid(validateRouteDesignationInput(event.target.value));
  };

  const handleRouteDesignationInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setRouteDesignationIsValid(true);
    }
  };

  // Driver Selection
  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
  };

  // Bus Selection
  const handleBusChange = (event) => {
    setSelectedBus(event.target.value);
  };

  // Add Route
  const handleAddRoute = () => {
    let newRoute = {
      id: {
        id: routeID,
        shift: routeShift,
      },
      designation: routeDesignation,
    };

    if (selectedDriver != "") {
      newRoute.driverId = selectedDriver;
    }

    if (selectedBus != "") {
      newRoute.busId = selectedBus;
    }

    fetch("http://localhost:8080/api/routes", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoute),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    handleCloseAddRouteModal();
  };

  // Handle Delete Route
  const handleDeleteRoute = (routeID, routeShift) => {
    fetch("http://localhost:8080/api/routes/" + routeID + "_" + routeShift, {
      method: "DELETE",
    }).catch((error) => {
      console.error("Error:", error);
    });
    console.log(routeID + "_" + routeShift + " deleted");
  };

  // Add Route Modal Handle Functions
  const handleOpenAddRouteModal = () => {
    setOpenAddRouteModal(true);
  };

  const handleCloseAddRouteModal = () => {
    setOpenAddRouteModal(false);
    setRouteID("");
    setRouteShift("");
    setRouteDesignation("");
    setSelectedDriver("");
    setSelectedBus("");
    setRouteIDIsValid(true);
    setRouteShiftIsValid(true);
    setRouteDesignationIsValid(true);
    setRouteIDInputHelpText("");
    setRouteShiftInputHelpText("");
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {routes == null || (buses == null) | (drivers == null) ? (
        <CircularProgress />
      ) : (
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
                    Routes
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddRouteModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Shift</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routes.slice(lower_bound, upper_bound).map((route) => (
                    <TableRow hover key={route.id.id + route.id.shift}>
                      <TableCell align="left">{route.id.id}</TableCell>
                      <TableCell align="left">{route.id.shift}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteRoute(route.id.id, route.id.shift)}>
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
              count={routes.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddRouteModal}
            onClose={handleCloseAddRouteModal}
            aria-labelledby="add-route-modal"
            aria-describedby="add-route-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-route-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Route
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddRouteModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="route-id">Route ID</InputLabel>
                  <Input
                    onFocus={handleRouteIDInputFocus}
                    onBlur={handleRouteIDInputBlur}
                    error={!routeIDIsValid}
                    id="route-id"
                    aria-describedby="route-id"
                    onChange={handleRouteIDInputChange}
                  />
                  <FormHelperText id="route-id">{routeIDInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="route-shift">Route Shift</InputLabel>
                  <Input
                    onFocus={handleRouteShiftInputFocus}
                    onBlur={handleRouteShiftInputBlur}
                    error={!routeShiftIsValid}
                    id="route-shift"
                    aria-describedby="route-shift"
                    onChange={handleRouteShiftInputChange}
                  />
                  <FormHelperText id="route-shift">{routeShiftInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="route-designation">Designation</InputLabel>
                  <Input
                    onFocus={handleRouteDesignationInputFocus}
                    onBlur={handleRouteDesignationInputBlur}
                    error={!routeDesignationIsValid}
                    id="route-designation"
                    aria-describedby="route-designation"
                    onChange={handleRouteDesignationInputChange}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="driver-id">Driver</InputLabel>
                  <Select
                    value={selectedDriver}
                    onChange={handleDriverChange}
                    id="driver-id"
                    aria-describedby="driver-id"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    {drivers.map((driver) =>
                      driver.routesId.length == 0 ? (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.id}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-id">Bus</InputLabel>
                  <Select
                    value={selectedBus}
                    onChange={handleBusChange}
                    id="bus-id"
                    aria-describedby="bus-id"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    {buses.map((bus) =>
                      bus.routesId.length == 0 ? (
                        <MenuItem key={bus.id} value={bus.id}>
                          {bus.id}
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
                    onClick={handleAddRoute}
                    disabled={
                      routeIDIsValid &&
                      routeID != "" &&
                      routeShiftIsValid &&
                      routeShift != "" &&
                      routeDesignationIsValid &&
                      routeDesignation != ""
                        ? false
                        : true
                    }
                  >
                    Add Route
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
    </>
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
