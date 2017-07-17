import React from 'react';
import config from '../config'
import _ from 'lodash';

export default class Commits extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const commits = this.props.commits.map((e, idx) =>
      <tr key={ idx }>
      <td>{ e.build }</td>
      <td>{ e.comment }</td>
      <td>{ e.date }</td>
      <td>{ e.sha }</td>
      <td>{ e.mergedBy }</td>
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
                  <th>Build</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>SHA</th>
                  <th>Merged By</th>
                </tr>
              </thead>
                <tbody>
                  { commits }
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
