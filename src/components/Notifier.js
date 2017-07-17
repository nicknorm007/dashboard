import React from 'react';

const Notifer = ({ latest }) => (
  <span style={ {'padding' : '20px'} }>
  { latest ? <span className="tag is-success">This is the latest Build</span> :
    <span className="tag is-danger">This is not the latest Build</span> }
  </span>
);


export default Notifer;
