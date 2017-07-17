import React from 'react';
import config from '../config'

const EnvButton = ({ env,build,status,clickHandler}) => {

  const buttonStyle = { 'backgroundColor' : config.getHSLAFromString(env) }
  const buttonSpanStyle = { 'paddingRight' : '20px' }


  const tagStyle = () => {

    return status==config.success ? "tag is-success" : "tag is-danger"
  }

  return <div>

  <span style={buttonSpanStyle}><a className="button is-medium"
    style={ buttonStyle } onClick={ clickHandler }>{ env.toUpperCase() }</a></span>
  <span className="tag is-info build">{build}</span>
  <span className={ tagStyle() }>{status}</span>

  </div>
}

EnvButton.defaultProps = {
  env: config.envs[0]
}

export default EnvButton;
