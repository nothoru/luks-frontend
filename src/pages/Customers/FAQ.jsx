// src/pages/Customers/FAQ.jsx
import React from "react";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Base from "../../components/Base";

const faqData = [
  {
    question: "Is my food cooked as soon as I submit my order online?",
    answer:
      "No, it is not. Submitting your order online simply generates an order ticket and saves your spot in the queue. Your food is only cooked fresh after you have arrived at the restaurant and paid at the counter. This ensures your meal is always hot and ready to enjoy!",
  },
  {
    question: "Do I pay online?",
    answer:
      "No. Our website works like a digital kiosk to help you build your order ahead of time. All payments must be made in person at the cashier's counter in our restaurant. We accept cash and GCash.",
  },
  {
    question: "What is the online ordering process?",
    answer:
      "It's simple! 1. Browse the menu and add items to your cart. 2. Submit your order to get your order number. 3. Visit our restaurant and show your order number to the cashier to pay. 4. We'll cook your food fresh and call your number when it's ready for pickup.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Currently, we do not offer a delivery service. All orders, whether placed online or in-person, must be picked up from our restaurant.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "We are open 24 hours a day from Monday to Saturday. We are closed on Sundays.",
  },
  {
    question: "Where are you located?",
    answer:
      "You can find us at 21 Samar Ave, South Triangle, Quezon City. You can view our location on the map on our Contact page.",
  },
];

const FAQ = () => {
  return (
    <Base>
      {/* Page Header */}
      <Box sx={{ bgcolor: "background.paper", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Have a question? We've got answers.
          </Typography>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              elevation={2}
              sx={{
                mb: 2,
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </Base>
  );
};

export default FAQ;
