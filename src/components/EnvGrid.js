import React from 'react';
import config from '../config';
import server from '../services/server'
import Deploys from './Deploys'
import Commits from './Commits'
import Notifier from './Notifier'
import _ from 'lodash';


class EnvGrid extends React.Component {


  constructor(props) {
    super(props);

    this.state = { buildNum: '', branch: '', version: '', buildDate: '',
                  sha: '', latestBranch: '', latestBranchResult: '',
                  appUrl: '', dockerDeployResult: '', latestDockerDeploy: '',
                  latestDevBuild: '', devBuildResult: '', deploys: [], envDeploys: [],
                  commits: [], showDeploys: false, showCommits: false,
                  buildStart: '', buildEnd: '', latest: '' }

  }

  componentDidMount() {
    this.gridUpdate();
  }
  componentDidUpdate(prevProps, prevState) {
    this.props.env != prevProps.env ? this.gridUpdate() : null;
  }
  gridUpdate() {

    server.getEnvironmentJson(this.props.env).then(data => {

      this.setState({version: data.app_version, buildNum: data.build_number,
                      branch: data.git.branch, buildDate: data.build_date,
                      sha: data.git.sha});

    }).catch(error => {
        console.log(error);

    });

    server.getDevBuildJson().then(data => {

      this.setState( {devBuildResult: data.result });
      this.setState( {latest: data.id });

    }).catch(error => {
        console.log(error);

    });

    server.getDeployBuildJson().then(data => {

      this.setState( { dockerDeployResult: data.result });
      server.getDeployBuildDataRange(data.number).then(res => {

        res.sort( function(a,b) {
          return new Date(b.deployDate) - new Date(a.deployDate);
        });

        this.setState( { deploys : res });
        let dockerDeploys = res.filter( deploy => deploy.deployedTo.includes( this.props.env ));

        dockerDeploys.sort( function(a,b) {
          return new Date(b.deployDate) - new Date(a.deployDate);
        });

        this.setState( { envDeploys: dockerDeploys } );

      });

    }).catch(error => {
        console.log(error);

    });


  }


  deployMessage = () => {

    let message = this.state.envDeploys.length > 0 ? `${this.state.envDeploys[0].startedBy}
      deployed to ${this.state.envDeploys[0].deployedTo} on ${this.state.envDeploys[0].deployDate}` : "No recent deploys to this environment!";

    return message;

  }

  statusColor = (indicator)=> {

    let success = 'hsla(102, 100%, 50%, 0.2)';
    let fail = 'hsla(360, 100%, 58%, 0.2)';
    return this.state[indicator] == config.success ? success : fail;

  }

  searchBuilds = (e)=> {

    let source = e.currentTarget.textContent;

    let start = source === config.view_changes_btn_text ? this.state.buildNum :
      this.state.buildStart;
    let end = source === config.view_changes_btn_text ? this.state.buildNum :
      this.state.buildEnd;

    server.getDevBuildHistory(start,end).then(res => {
      this.setState( { commits: res } );
      this.showCommitModal();
    });

  }


  showDeployModal = ()=> this.setState({ showDeploys: true})

  closeDeployModal = ()=> this.setState({ showDeploys: false})

  showCommitModal = ()=> this.setState({ showCommits: true})

  closeCommitModal = ()=> this.setState({ showCommits: false})

  onChangeStart = (e)=> this.setState({ buildStart: e.target.value})

  onChangeEnd = (e)=> this.setState({ buildEnd: e.target.value })

  render() {

    const tableStyle = {  'tableLayout' : 'fixed', 'width' : '95%', 'marginLeft' : 'auto', 'marginRight': 'auto' }

    return (
      <div>
      { this.state.showDeploys ? <Deploys closeModal={ this.closeDeployModal } deploys={ this.state.deploys }/> : null }
      { this.state.showCommits ? <Commits closeModal={ this.closeCommitModal } commits={ this.state.commits }/> : null }
      <table className="table is-bordered is-striped" style={tableStyle}>
          <tbody>
            <tr>
              <td className="labelCol">Build Number on <strong>{ this.props.env.toUpperCase() }</strong> </td>
              <td>{ this.state.buildNum }<Notifier latest={ this.state.latest == this.state.buildNum }/></td>
            </tr>
            <tr>
              <td className="labelCol">Branch</td>
              <td>{ this.state.branch }</td>
            </tr>
            <tr>
              <td className="labelCol">Version</td>
              <td>{ this.state.version }</td>
            </tr>
            <tr>
              <td className="labelCol">Build Date</td>
              <td>{ this.state.buildDate }</td>
            </tr>
            <tr>
              <td className="labelCol">Git SHA</td>
              <td>{ this.state.sha.slice(0,7) }</td>
            </tr>
            <tr>
              <td className="labelCol">Latest Branch Result</td>
              <td style={ {'backgroundColor' : this.statusColor('devBuildResult')} }>
                { this.state.devBuildResult }<span style={ {'padding' : '50px'} }><a className="button is-warning is-small"
                  onClick={ this.searchBuilds }>{config.view_changes_btn_text}</a></span>
                  <span style={ {'padding' : '10px'} }><strong>Search older build range : </strong>
                    <input value={ this.state.buildStart } onChange={this.onChangeStart} placeholder="###" maxLength="3" size="3"></input> -
                      <input value={ this.state.buildEnd } onChange={this.onChangeEnd} placeholder="###" maxLength="3" size="3">
                      </input></span><span style={ {'padding' : '10px'} }><a className="button is-warning is-small"
                        onClick={ this.searchBuilds }>Search</a></span></td>
            </tr>
            <tr>
              <td className="labelCol">App URL</td>
              <td><a href={ `${config.httpsPrefix}${ config.appUrlPrefix[this.props.env] }${config.appDomain}` } target="_blank">
                Authoring { this.props.env.toUpperCase() } Environment</a></td>
            </tr>
            <tr>
              <td className="labelCol">Docker Deploy Job</td>
              <td><a href={ config.deployJobUrl } target="_blank">Go to Deploy Job</a></td>
            </tr>
            <tr>
              <td className="labelCol">Latest Docker Deploy Result (All Envs)</td>
              <td style={ {'backgroundColor' : this.statusColor('dockerDeployResult')} }>
                { this.state.dockerDeployResult }
                <span style={ {'padding' : '50px'} }><a className="button is-warning is-small"
                  onClick={ this.showDeployModal }> Last 25 Deploys (All Envs)</a></span></td>
            </tr>
            <tr>
              <td className="labelCol">Last Docker Deploy on {this.props.env.toUpperCase() }</td>
              <td>{ this.deployMessage() }</td>
            </tr>
            <tr>
              <td className="labelCol">Dev Branch Builds</td>
              <td><a href={ config.devBranchBuilds } target="_blank">Go to Branch Builds</a></td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }

}

EnvGrid.defaultProps = {
  env: config.envs[0]
}

export default EnvGrid;
