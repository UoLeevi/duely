import React, { useRef } from 'react';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import Background from 'components/Background';
import './HomeFeaturesSection.css';

const HomeFeaturesSection = ({ ...props }) => {
  const ref = useRef();
  useIntersectionObserver(ref, (entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('intersecting');
    } else {
      entry.target.classList.remove('intersecting');
    }
  }, { threshold: 0.1 });
  return (
    <Background className="home-features-section gutter" placeItems="center" { ...props }>
      <svg className="home-features-section-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 300 120">

      </svg>
      <section>
        <div ref={ ref }>
          <ul className="f-6 f-b">
            <li>Create a service catalogue</li>
            <li>Manage client deliverables and projects</li>
            <li>Setup invoicing and accept payments</li>
          </ul>
        </div>
      </section>
    </Background>
  );
};

export default HomeFeaturesSection;
