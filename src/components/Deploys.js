import React from 'react';
import config from '../config'
import _ from 'lodash';

export default class Deploys extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const deploys = this.props.deploys.map((e, idx) =>
      <tr key={ idx }>
      <td>{ e.startedBy }</td>
      <td>{ e.deployedTo }</td>
      <td>{ e.deployDate }</td>
      </tr>
    );

    return (
      <div>
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Commits in Build</p>
              <button className="delete" onClick={ this.props.closeModal }></button>
            </header>
            <section className="modal-card-body">
            <table className="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th>Started By</th>
                  <th>Deployed To</th>
                  <th>Deploy Date</th>
                </tr>
              </thead>
                <tbody>
                  { deploys }
                </tbody>
                </table>
            </section>
            <footer className="modal-card-foot">
              <a className="button" onClick={ this.props.closeModal }>Close</a>
            </footer>
          </div>
        </div>
      </div>
    );
  }

}
