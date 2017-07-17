import React from 'react'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import config from './config'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Header title="Environment Information"
          subtitle=" Dashboard"/>
        <StatusBar envs={config.envs}/>

      </div>
    )
  }
}
