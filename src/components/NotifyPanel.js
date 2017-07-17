import React from 'react';
import config from '../config'

const NotifyPanel = ({env, status}) => {


  const containerStyle = { 'padding' : '20px'}

  const notifyStyle = () => {

    let success = 'hsla(102, 100%, 50%, 0.2)'
    let fail = 'hsla(360, 100%, 58%, 0.2)'

    let colorNotify = status==config.success ? success : fail

    let notifyStyle = { 'textAlign' : 'center', 'backgroundColor' : colorNotify}
    return notifyStyle
  }

  return <div>

  <div className="container" style={ containerStyle }>

    <div className="notification" style={ notifyStyle() }>
      <strong>Currently Viewing : {env.toUpperCase()} Environment</strong>
    </div>

  </div>

  </div>


}

NotifyPanel.defaultProps = {
  env: config.envs[0]
}
export default NotifyPanel;
