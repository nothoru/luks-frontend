// src/pages/Customers/Home.jsx (Updated)

import React from "react";
import Base from "../../components/Base";
import HeroSection from "../../components/customer/HeroSection";
import HowItWorks from "../../components/customer/HowItWorks";
import Specialties from "../../components/customer/Specialties";
import CustomerGallery from "../../components/customer/CustomerGallery";
import FinalCTA from "../../components/customer/FinalCTA";

const Home = () => {
  return (
    <Base>
      <HeroSection />
      <HowItWorks />
      <Specialties />
      <CustomerGallery />
      <FinalCTA />
    </Base>
  );
};

export default Home;
