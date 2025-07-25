// src/pages/Customers/Authentication/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useSearchParams, } from "react-router-dom";
import { TextField, Button, Typography, Box, Grid, Link, Paper, Alert, IconButton, InputAdornment, } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import Base from "../../../components/Base";
import brand from "../../../assets/restaurant/brand1.png";

const BRANDING_IMAGE_URL = brand;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    const isActivated = searchParams.get("activated") === "true";
    const activationError = searchParams.get("error") === "activation_failed";
    const alreadyActive = searchParams.get("message") === "already_active";

    if (isActivated)
      setAlertInfo({
        show: true,
        severity: "success",
        message: "Account activated successfully! You can now log in.",
      });
    else if (activationError)
      setAlertInfo({
        show: true,
        severity: "error",
        message: "Activation failed. The link may be invalid or has expired.",
      });
    else if (alreadyActive)
      setAlertInfo({
        show: true,
        severity: "info",
        message: "Your account is already active. Please log in.",
      });
  }, [searchParams]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAlertInfo({ show: false });

    try {
      const response = await axiosInstance.post("/api/users/token/", {
        email: formData.email,
        password: formData.password,
      });
      const decodedToken = jwtDecode(response.data.access);
      login({
        ...response.data,
        role: decodedToken.role,
        id: decodedToken.user_id,
      });
      if (decodedToken.role === "admin" || decodedToken.role === "staff")
        navigate("/admin/dashboard");
      else navigate("/");
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.code === "account_not_active") {
        setErrors({
          form: "This account is not active. Please check your email for the activation link.",
        });
      } else {
        setErrors({ form: "Invalid email or password." });
      }
      console.error("Login failed:", errorData || error.message);
    }
  };

  return (
    <Base showFooter={false}>
      <Grid container component="main" sx={{ height: "calc(100vh - 64px)" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${BRANDING_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              {alertInfo.show && (
                <Alert severity={alertInfo.severity} sx={{ mt: 2, mb: 1 }}>
                  {alertInfo.message}
                </Alert>
              )}
              {errors.form && (
                <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                  {errors.form}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Base>
  );
};

export default Login;
