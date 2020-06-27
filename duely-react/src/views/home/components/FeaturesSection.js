import React, { useRef } from 'react';
import './FeaturesSection.css';
import { useIntersectionObserver } from '../../../hooks';
import Background from '../../../components/Background';

const FeaturesSection = () => {
  const ref = useRef();
  useIntersectionObserver(ref, (entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('intersecting');
    } else {
      entry.target.classList.remove('intersecting');
    }
  }, { threshold: 0.1 });
  return (
    <Background fullscreen>
      <svg className="home-features-section-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 300 120">

      </svg>
      <section className="home-features-section gutter">
        <div ref={ ref }>
          <ul className="f-6 f-b">
            <li>Create a service catalogue</li>
            <li>Manage client deliverables and projects</li>
            <li>Accept payments and setup invoicing</li>
          </ul>
        </div>
      </section>
    </Background>
  );
};
export default FeaturesSection;
