import { useState, useEffect } from "react";

import {
  Avatar,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  styled,
  IconButton,
  Alert,
} from "@mui/material";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { State, City } from "country-state-city";
import swal from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import DescriptionIcon from "@mui/icons-material/Description";

function App() {
  const [candidateData, setCandidateData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [rdoc, setDoc] = useState("");
  const [cities, setCitiesData] = useState([]);

  const states = State.getStatesOfCountry("IN");

  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [errors, setErrors] = useState(false)


  const Input = styled("input")({
    display: "none",
  });

  const resetForm = () => {
    setEmail("");
    setName("");
    setDate(null);
    setGender("");
    setCity('');
    setStateCode("");
    setProfileImage("");
    setFileName1("")
    setDoc("");
    setFileName2("")
    setErrors(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(name === "" || email === "" || rdoc === "" || profileImage === "") {
      setErrors(true)
      return false;
    }


    const dob = dayjs(date).format("MM-DD-YYYY");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("gender", gender);
    formData.append("pimage", profileImage);
    formData.append("rdoc", rdoc);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to form data
          },
        }
      );

      swal({ icon: "success", text: response.data.success });
      resetForm();
      litCandidates();
    } catch (error) {
      console.error("Error:", error);
      swal("Oops!", "Something went wrong!", "error");
    }
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const FormatDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    return FormatDate;
  };

  const deleteCandidateProfile = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:8000/api/resume/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      litCandidates();
      swal({ icon: "success", text: result.data.success });
    } catch (error) {
      console.log(error);
    }
  };

  const litCandidates = async () => {
    try {
      const result = await axios.get(`http://localhost:8000/api/resume`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCandidateData(result.data.data);
    } catch (error) {
      console.log(error);
      setCandidateData([]);
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const cities = City.getCitiesOfState("IN", stateCode);
    const selectedState = State.getStateByCodeAndCountry(stateCode, "IN");
    setState(selectedState.name);
    setCitiesData(cities);
    setStateCode(stateCode)
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setCity(cityCode);
  };

  const openPDFInNewTab = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    litCandidates();
  }, []);
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{ backgroundColor: "error.light", padding: 2 }}
      >
        <Typography
          variant="h2"
          component={"div"}
          sx={{ fontWeight: "bold", color: "white" }}
        >
          File Uploder
        </Typography>
      </Box>

      <Grid container justifyContent={"center"}>
        <Grid item xs={5}>
          <Box
            component={"form"}
            sx={{ p: 3 }}
            noValidate
            id="resumeForm"
            onSubmit={handleSubmit}
          >
            <TextField
              name="name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              label="Name"
            />
            <TextField
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              label="Email"
            />
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  label="Date of Birth"
                  onChange={(val) => setDate(val)}
                />
              </LocalizationProvider>
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel id="demo-simple-select-label">State</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={stateCode}
                onChange={(e) => handleStateChange(e)}
              >
                {states.map((it) => (
                  <MenuItem value={it.isoCode}>{it.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="City"
                value={city}
                disabled={cities.length === 0 ? true : false}
                onChange={(e) => handleCityChange(e)}
              >
                {cities.map((it) => (
                  <MenuItem value={it.name}>{it.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal">
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>

            <Stack
              margin="normal"
              direction={"row"}
              alignItems={"center"}
              spacing={4}
            >
              {fileName1 === "" && (
                <label htmlFor="profile-photo">
                  <Input
                    accept="image/*"
                    id="profile-photo"
                    type="file"
                    disabled={fileName1 !== ""}
                    onChange={(e) => {
                      setProfileImage(e.target.files[0]);
                      setFileName1(e.target.files[0].name);
                    }}
                  />

                  <Button variant="contained" component="span">
                    Upload Photo
                  </Button>
                </label>
              )}

              {fileName1 !== "" && (
                <Alert
                  severity="success"
                  onClose={() => {
                    setFileName1("");
                    setProfileImage("");
                  }}
                >
                  {fileName1}
                </Alert>
              )}

              {fileName2 === "" && (
                <label htmlFor="resume-file">
                  <Input
                    accept="doc/*"
                    id="resume-file"
                    type="file"
                    onChange={(e) => {
                      setDoc(e.target.files[0]);
                      setFileName2(e.target.files[0].name);
                    }}
                  />

                  <Button variant="contained" component="span">
                    Upload File
                  </Button>
                </label>
              )}

              {fileName2 !== "" && (
                <Alert
                  severity="success"
                  onClose={() => {
                    setFileName2("");
                    setDoc("");
                  }}
                >
                  {fileName2}
                </Alert>
              )}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, px: 5 }}
              color="error"
            >
              Submit
            </Button>

            {errors && <Alert severity="error">
              {"All Fields are required"}
            </Alert>}
          </Box>
        </Grid>

        <Grid item xs={7}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{ backgroundColor: "info.light", padding: 2 }}
          >
            <Typography
              variant="h5"
              component={"div"}
              sx={{ fontWeight: "bold", color: "white" }}
            >
              List of Candidates
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    DOB
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    State
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    City
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Gender
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Profile
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Resume
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidateData.length > 0 ? (
                  candidateData.map((item, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.email}</TableCell>
                      <TableCell align="center">
                        {formattedDate(item.dob)}
                      </TableCell>
                      <TableCell align="center">{item.state}</TableCell>
                      <TableCell align="center">{item.city}</TableCell>
                      <TableCell align="center">{item.gender}</TableCell>
                      <TableCell align="center">
                        <Avatar src={`http://localhost:8000/${item.pimage}`} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            openPDFInNewTab(
                              `http://localhost:8000/${item.rdoc}`
                            )
                          }
                        >
                          <DescriptionIcon />
                        </IconButton>
                        {/* <a href={`http://localhost:8000/${item.rdoc}`} target="_blank" >{item.rdoc}</a> */}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          sx={{ color: "red" }}
                          onClick={() => deleteCandidateProfile(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={7} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
