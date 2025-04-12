import React from "react";
import "./AboutUs.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@mui/material";
import {
  Landmark,
  Target,
  Briefcase,
  BarChart3,
  HeartHandshake,
  Eye,
} from "lucide-react";

export default function AboutUs() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const testimonials = [
    {
      name: "Sarah M.",
      position: "Business Owner",
      text: "BizTrack has revolutionized our invoicing process. Highly recommended!",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "John D.",
      position: "CEO",
      text: "The best investment we made for our company. Exceptional support!",
      image: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Emily R.",
      position: "CFO",
      text: "Seamless inventory tracking has helped us scale efficiently.",
      image: "https://i.pravatar.cc/100?img=3",
    },
    {
      name: "Michael B.",
      position: "Operations Manager",
      text: "Automation at its best! A game changer for our business.",
      image: "https://i.pravatar.cc/100?img=4",
    },
    {
      name: "Lisa K.",
      position: "Entrepreneur",
      text: "User-friendly and efficient. My go-to business tool.",
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "David W.",
      position: "Retail Owner",
      text: "Saved us hours of manual work every week.",
      image: "https://i.pravatar.cc/100?img=6",
    },
    {
      name: "Sophia H.",
      position: "Founder",
      text: "Customer support is top-notch. They always have our back!",
      image: "https://i.pravatar.cc/100?img=7",
    },
  ];

  return (
    <div className={`about-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="about-header"
      >
        <h1>About BizTrack</h1>
        <p>
          Driving business success with smart billing and inventory management.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="about-content"
      >
        {[
          {
            title: "Our History",
            text: "Founded in 2018, BizTrack has been transforming the way businesses handle their operations with cutting-edge solutions.",
            icon: <Landmark size={24} />,
          },
          {
            title: "Our Mission",
            text: "To simplify financial management and streamline operations for businesses of all sizes, enabling efficiency and growth.",
            icon: <Target size={24} />,
          },
          {
            title: "Our Experience",
            text: "With over 6 years in the industry, we have served thousands of businesses worldwide, helping them achieve operational excellence.",
            icon: <Briefcase size={24} />,
          },
        ].map((section, index) => (
          <Card key={index} className="about-card">
            <CardContent>
              {section.icon}
              <h2> {section.title}</h2>

              <p>{section.text}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="about-content"
      >
        {[
          {
            title: "Key Numbers",
            text: "10,000+ businesses onboarded, 1M+ invoices processed, 99.9% uptime for seamless operations, 24/7 customer support.",
            icon: <BarChart3 size={24} />,
          },
          {
            title: "Core Values",
            text: "Integrity, innovation, and customer satisfaction drive everything we do.",
            icon: <HeartHandshake size={24} />,
          },
          {
            title: "Future Vision",
            text: "We aim to expand our global footprint, enhance AI-driven analytics, and introduce seamless integrations for a smarter business experience.",
            icon: <Eye size={24} />,
          },
        ].map((section, index) => (
          <Card key={index} className="about-card">
            <CardContent>
              {section.icon}
              <h2>{section.title}</h2>

              <p>{section.text}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="testimonial-container">
        <h1>Customer Testimonials</h1>
        <div>
          <motion.div
            className="testimonial-scroll"
            whileTap={{ cursor: "grabbing" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="testimonial-image"
                />
                <h3>{testimonial.name}</h3>
                <p className="testimonial-position">{testimonial.position}</p>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
