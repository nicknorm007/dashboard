import React from 'react';

const Header = ({title, subtitle}) => (
  <div>
    <section className="hero is-bold" style={{ 'backgroundColor' : 'hsla(120, 60%, 70%, 0.3)' }}>
      <div className="hero-body" style={{ 'textAlign' : 'center', 'textShadow': '1px 1px'}}>
        <div className="container">
          <h1 className="title">
            {title}
          </h1>
          <h2 className="subtitle">
            {subtitle}
          </h2>
        </div>
      </div>
    </section>
  </div>
);

export default Header;
