import React from 'react';

import EnvButton from './EnvButton'
import NotifyPanel from './NotifyPanel'
import config from '../config'
import server from '../services/server'
import EnvGrid from './EnvGrid'
import AutoRefreshButton from './AutoRefreshButton'
import _ from 'lodash';


export default class StatusBar extends React.Component {

  constructor(props) {
    super(props);

    let envObj = {'currentEnv' : config.envs[0]};

    props.envs.forEach(e => {
      Object.assign(envObj, { [e] : { 'build' : '', 'status' : '' } } );
    });
    Object.assign(envObj, { 'refresh' : false } );
    this.state = envObj;

  }

  componentDidMount() {

    this.refreshStatusBar();

  }

  refreshStatusBar = () => {

    this.props.envs.forEach(e => {

      server.getEnvironmentJson(e).then(res => {
        let data = res;
        data.build_number = data.build_number ? data.build_number : "None";
        data.status = data.build_number ? config.success : config.fail;
        let stateObj = {};
        stateObj = data.build_number > 0 ? { [e] : { 'build' : data.build_number , 'status' : data.status } } :
          { [e] : { 'build' : data.build_number , 'status' : config.fail } }
        this.setState(stateObj);

      });

    });


  }

  handleClick = (e) => {

    let currentEnvironment = e.currentTarget.textContent.toLowerCase();
    this.setState({ 'currentEnv' : currentEnvironment})

  }

  handleCheck = (e) => {
    this.setState({ 'refresh' : !this.state.refresh }, this.handleRefresh)

  }
  handleRefresh = () => {
    let intervalID;

    if( this.state.refresh ){
      intervalID = setInterval(() => {
        this.refreshStatusBar()
      }, 30000);
      this.setState({intervalID: intervalID});
    }
    else {
      clearInterval(this.state.intervalID);
    }

  }
  render() {

    const style = { 'backgroundColor' : config.getHSLAFromString('StatusBar') }
    const refreshStyle = { 'position' : 'relative' ,'left' : '260px' }


    const environmentBtns = this.props.envs.map((e, idx) =>
      <div key={ idx } className="column">
      <EnvButton key={ idx } env={ e } build={ this.state[e].build }
        status={ this.state[e].status } clickHandler={ this.handleClick } />
      </div>
    );

    return (
      <div>
        <div className="box" style={style}>
          <div className="columns">
          { environmentBtns }
        </div>
        </div>
        <NotifyPanel env={ this.state.currentEnv } status={config.success}/>

        <div style={ refreshStyle }>
          <AutoRefreshButton checked={ this.state.refresh } checkHandler={ this.handleCheck }/>
        </div>
        <EnvGrid env={ this.state.currentEnv }/>

      </div>
    );
  }

}
