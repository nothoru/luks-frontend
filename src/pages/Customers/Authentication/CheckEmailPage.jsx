// src/pages/Customers/Authentication/CheckEmailPage.jsx
import React from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import Base from "../../../components/Base";

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email address";

  return (
    <Base>
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <MarkEmailReadOutlinedIcon
            sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
          />
          <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
            Please Check Your Email
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            We've sent an activation link to:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", my: 1 }}>
            {email}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Click the link in the email to complete your registration. If you
            don't see it, please check your spam folder.
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            variant="contained"
            sx={{ mt: 4 }}
          >
            Back to Login
          </Button>
        </Paper>
      </Container>
    </Base>
  );
};

export default CheckEmailPage;
