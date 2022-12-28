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

export const DeviceTable = ({ devices, buses, ...rest }) => {
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddDeviceModal, setOpenAddDeviceModel] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [deviceID, setDeviceID] = useState("");
  const [deviceIDIsValid, setDeviceIDIsValid] = useState(true);
  const [deviceIDInputHelpText, setDeviceIDInputHelpText] = useState("");
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

  // Device ID Input Handle Function and Validation
  const validateDeviceIDInput = (deviceID) => {
    let pattern = /^AVRBUS-D[0-9]{4}$/;
    let deviceId_is_valid = false;
    if (pattern.test(deviceID)) {
      deviceId_is_valid = true;

      devices.forEach((device) => {
        if (device.id == deviceID) {
          deviceId_is_valid = false;
          setDeviceIDInputHelpText("Device ID already exists");
        }
      });
    } else {
      deviceId_is_valid = false;
      setDeviceIDInputHelpText("Should be in the form of AVRBUS-DXXXX");
    }
    return deviceId_is_valid;
  };

  const handleDeviceIDInputChange = (event) => {
    let val = validateDeviceIDInput(event.target.value);
    setDeviceIDIsValid(val);
    if (val) {
      setDeviceID(event.target.value);
    }
  };

  const handleDeviceIDInputFocus = (event) => {
    setDeviceIDIsValid(validateDeviceIDInput(event.target.value));
  };

  const handleDeviceIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setDeviceIDIsValid(true);
      setDeviceIDInputHelpText("");
    } else {
      if (validateDeviceIDInput(val)) {
        setDeviceIDInputHelpText("");
      }
    }
  };

  // Bus Selection
  const handleBusChange = (event) => {
    setSelectedBus(event.target.value);
  };

  // Add Device
  const handleAddDevice = () => {
    let newDevice = {
      id: deviceID,
    };

    if (selectedBus != "") {
      newBus.busId = selectedBus;
    }

    fetch("http://localhost:8080/api/devices", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDevice),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    handleCloseAddDeviceModal();
  };

  // Handle Delete Device
  const handleDeleteDevice = (deviceID) => {
    fetch("http://localhost:8080/api/devices/" + deviceID, {
      method: "DELETE",
    }).catch((error) => {
      console.error("Error:", error);
    });
    console.log(deviceID + " deleted");
  };

  // Add Device Modal Handle Functions
  const handleOpenAddDeviceModal = () => {
    setOpenAddDeviceModel(true);
  };

  const handleCloseAddDeviceModal = () => {
    setOpenAddDeviceModel(false);
    setDeviceID("");
    setDeviceIDIsValid(true);
    setDeviceIDInputHelpText("");
    setSelectedBus("");
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {devices == null || buses == null ? (
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
                    Devices
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddDeviceModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Bus Id</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.slice(lower_bound, upper_bound).map((device) => (
                    <TableRow hover key={device.id}>
                      <TableCell align="left">{device.id}</TableCell>
                      <TableCell align="left">{device.busId}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteDevice(device.id)}>
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
              count={devices.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddDeviceModal}
            onClose={handleCloseAddDeviceModal}
            aria-labelledby="add-device-modal"
            aria-describedby="add-device-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-device-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Device
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddDeviceModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="device-id">Device ID</InputLabel>
                  <Input
                    onFocus={handleDeviceIDInputFocus}
                    onBlur={handleDeviceIDInputBlur}
                    error={!deviceIDIsValid}
                    id="device-id"
                    aria-describedby="device-id"
                    onChange={handleDeviceIDInputChange}
                  />
                  <FormHelperText id="device-id">{deviceIDInputHelpText}</FormHelperText>
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
                      bus.deviceId == null ? (
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
                  <Button
                    variant="contained"
                    onClick={handleAddDevice}
                    disabled={deviceIDIsValid && deviceID != "" ? false : true}
                  >
                    Add Device
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
