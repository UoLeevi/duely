import React from 'react';
import { motion } from 'framer-motion';
import './FeaturesSection.css';

const FeaturesSection = () => {

  return (
    <section className="home-features-section">
      <div>
        <ul className="f-6">
          <li>Create a service catalogue</li>
          <li>Manage client deliverables and projects</li>
          <li>Accept payments and setup invoicing</li>
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
