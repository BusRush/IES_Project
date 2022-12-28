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

export const DriverTable = ({ drivers, routes, ...rest }) => {
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddDriverModal, setOpenAddDriverModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [driverID, setDriverID] = useState("");
  const [driverIDIsValid, setDriverIDIsValid] = useState(true);
  const [driverIDInputHelpText, setDriverIDInputHelpText] = useState("");
  const [driverFirstName, setDriverFirstName] = useState("");
  const [driverFirstNameIsValid, setDriverFirstNameIsValid] = useState(true);
  const [driverLastName, setDriverLastName] = useState("");
  const [driverLastNameIsValid, setDriverLastNameIsValid] = useState(true);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

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

  // Driver ID Input Handle Function and Validation
  const validateDriverIDInput = (driverID) => {
    let pattern = /^AVRBUS-C[0-9]{4}$/;
    let driverId_is_valid = false;
    if (pattern.test(driverID)) {
      driverId_is_valid = true;

      drivers.forEach((driver) => {
        if (driver.id == driverID) {
          driverId_is_valid = false;
          setDriverIDInputHelpText("Driver ID already exists");
        }
      });
    } else {
      driverId_is_valid = false;
      setDriverIDInputHelpText("Should be in the form of AVRBUS-CXXXX");
    }
    return driverId_is_valid;
  };

  const handleDriverIDInputChange = (event) => {
    let val = validateDriverIDInput(event.target.value);
    setDriverIDIsValid(val);
    if (val) {
      setDriverID(event.target.value);
    }
  };

  const handleDriverIDInputFocus = (event) => {
    setDriverIDIsValid(validateDriverIDInput(event.target.value));
  };

  const handleDriverIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setDriverIDIsValid(true);
      setDriverIDInputHelpText("");
    } else {
      if (validateDriverIDInput(val)) {
        setDriverIDInputHelpText("");
      }
    }
  };

  // Driver First Name Input Handle Function and Validation
  const validateDriverFirstNameInput = (driverFirstName) => {
    if (driverFirstName.length > 0) {
      return true;
    }
    return false;
  };

  const handleDriverFirstNameInputChange = (event) => {
    let val = validateDriverFirstNameInput(event.target.value);
    setDriverFirstNameIsValid(val);
    if (val) {
      setDriverFirstName(event.target.value);
    }
  };

  const handleDriverFirstNameInputFocus = (event) => {
    setDriverFirstNameIsValid(validateDriverFirstNameInput(event.target.value));
  };

  const handleDriverFirstNameInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setDriverFirstNameIsValid(true);
    }
  };

  // Driver Last Name Input Handle Function and Validation
  const validateDriverLastNameInput = (driverLastName) => {
    if (driverLastName.length > 0) {
      return true;
    }
    return false;
  };

  const handleDriverLastNameInputChange = (event) => {
    let val = validateDriverLastNameInput(event.target.value);
    setDriverLastNameIsValid(val);
    if (val) {
      setDriverLastName(event.target.value);
    }
  };

  const handleDriverLastNameInputFocus = (event) => {
    setDriverLastNameIsValid(validateDriverLastNameInput(event.target.value));
  };

  const handleDriverLastNameInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setDriverLastNameIsValid(true);
    }
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

  // Add Driver
  const handleAddDriver = () => {
    let routesID = [];
    selectedRoutes.forEach((route) => {
      let content = route.split("|");
      routesID.push({ id: content[0], shift: content[1] });
    });

    let newDriver = {
      id: driverID,
      firstName: driverFirstName,
      lastName: driverLastName,
    };

    if (routesID.length > 0) {
      newDriver.routesId = routesID;
    }

    fetch("http://localhost:8080/api/drivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDriver),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    handleCloseAddDriverModal();
  };

  // Delete Driver
  const handleDeleteDriver = (driverID) => {
    fetch("http://localhost:8080/api/drivers/" + driverID, {
      method: "DELETE",
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  // Add Driver Modal Handle Functions
  const handleOpenAddDriverModal = () => {
    setOpenAddDriverModal(true);
  };

  const handleCloseAddDriverModal = () => {
    setOpenAddDriverModal(false);
    setDriverID("");
    setDriverFirstName("");
    setDriverLastName("");
    setSelectedRoutes([]);
    setDriverIDInputHelpText("");
    setDriverIDIsValid(true);
    setDriverFirstNameIsValid(true);
    setDriverLastNameIsValid(true);
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {drivers == null || routes == null ? (
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
                    Drivers
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddDriverModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.slice(lower_bound, upper_bound).map((driver) => (
                    <TableRow hover key={driver.id}>
                      <TableCell align="left">{driver.id}</TableCell>
                      <TableCell align="left">
                        {driver.firstName} {driver.lastName}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteDriver(driver.id)}>
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
              count={drivers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddDriverModal}
            onClose={handleCloseAddDriverModal}
            aria-labelledby="add-driver-modal"
            aria-describedby="add-driver-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-driver-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Driver
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddDriverModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="bus-id">Driver ID</InputLabel>
                  <Input
                    onFocus={handleDriverIDInputFocus}
                    onBlur={handleDriverIDInputBlur}
                    error={!driverIDIsValid}
                    id="driver-id"
                    aria-describedby="driver-id"
                    onChange={handleDriverIDInputChange}
                  />
                  <FormHelperText id="driver-id">{driverIDInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="driver-first-name">First Name</InputLabel>
                  <Input
                    onFocus={handleDriverFirstNameInputFocus}
                    onBlur={handleDriverFirstNameInputBlur}
                    error={!driverFirstNameIsValid}
                    id="driver-first-name"
                    aria-describedby="driver-first-name"
                    onChange={handleDriverFirstNameInputChange}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="driver-last-name">Last Name</InputLabel>
                  <Input
                    onFocus={handleDriverLastNameInputFocus}
                    onBlur={handleDriverLastNameInputBlur}
                    error={!driverLastNameIsValid}
                    id="driver-last-name"
                    aria-describedby="driver-last-name"
                    onChange={handleDriverLastNameInputChange}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="driver-routes">Routes</InputLabel>
                  <Select
                    multiple={true}
                    value={selectedRoutes}
                    onChange={handleRoutesChange}
                    id="driver-routes"
                    aria-describedby="driver-routes"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
                  >
                    {routes.map((route) =>
                      route.driverId == null ? (
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
                    onClick={handleAddDriver}
                    disabled={
                      driverIDIsValid &&
                      driverID != "" &&
                      driverFirstNameIsValid &&
                      driverFirstName != "" &&
                      driverLastNameIsValid &&
                      driverLastName != ""
                        ? false
                        : true
                    }
                  >
                    Add Driver
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
