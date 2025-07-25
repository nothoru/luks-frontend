// src/pages/Customers/TermsAndConditions.jsx

import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import Base from "../../components/Base";

const TermsAndConditions = () => {
  return (
    <Base>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Terms and Conditions
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: July 23, 2025
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
            1. Account Registration
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>
              To use certain features of our service, such as online
              pre-ordering, you must register for an account.
            </li>
            <li>
              You must provide accurate and complete information and keep your
              account information updated.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your computer.
            </li>
            <li>
              You agree to accept responsibility for all activities that occur
              under your account or password.
            </li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
            2. Online Ordering Process
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>
              Our website functions as a digital kiosk to allow you to build
              your order ahead of time. This is a pre-ordering service, not an
              advance-ordering or delivery service.
            </li>
            <li>
              <strong>No Payment Online:</strong> We do not process payments
              through our website. All payments for orders must be made
              in-person at our restaurant's counter.
            </li>
            <li>
              <strong>Order Confirmation:</strong> Submitting an order online
              generates an order ticket and places you in the queue. Your food
              will only be prepared after you have arrived at the restaurant and
              paid for your order at the cashier.
            </li>
            <li>
              We reserve the right to refuse or cancel any order for any reason,
              including limitations on quantities available for purchase or
              errors in product or pricing information.
            </li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
            3. Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about these Terms, please contact us at
            luksbygoodchoice@gmail.com.
          </Typography>
        </Paper>
      </Container>
    </Base>
  );
};

export default TermsAndConditions;
