import React from 'react';

const AutoRefreshButton = ({ checked, checkHandler }) => {

  return <div style={ {'padding' : '5px'} }>
    <span><strong>Auto Refresh:</strong></span>
    <span>
      <label className="switch">
        <input type="checkbox" checked={ checked } onChange={ checkHandler } />
        <div className="slider round" />
      </label>
    </span>
    </div>


}

export default AutoRefreshButton;
