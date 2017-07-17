import axios from 'axios';
import config from '../config';
import _ from 'lodash';

const jenkinsBase = axios.create({ baseURL: `` });

let devBuildURLPath = (build = '') => {

  return build.length > 0 ? `-Dev-Branch-CI/${ build }/api/json` :
    `-Dev-Branch-CI/lastBuild/api/json`

}
let deployBuildURLPath = (build = '') => {

  return build.length > 0 ? `/${ build }/api/json` :
    `/lastBuild/api/json`

}
let appURLPath = (env) => {

  let suffix = config.getRandomSuffix(7);
  let prefix = config.appUrlPrefix[env];

  return `https://${ prefix }./build-info.json?v=${ suffix }`

}

let determineUserName = (actions) => {

  let user = '';

  _.forEach(actions, act => {
      if (act.hasOwnProperty("causes")){
        user = act.causes[0].userName;
      }
  });

  return user;


}
let determineDeployedTo = (actions) => {

  let deployedEnv = '';

  _.forEach(actions, act => {
      if (act.hasOwnProperty("parameters")){
        deployedEnv = act.parameters[1].value;
      }
  });

  return deployedEnv;


}

export default {

  getDevBuildJson( build = '' ) {
      return jenkinsBase.get(devBuildURLPath(build)).then((res) => {
          return res.data;
      });
  },
  getEnvironmentJson(env) {
      return axios.get(appURLPath(env)).then((res) => {
          return res.data;
      });
  },
  getDeployBuildJson( build = '' ) {
      return jenkinsBase.get(deployBuildURLPath(build)).then((res) => {
          return res.data;
      });
  },
  getDeployBuildDataRange(num, goback = 25) {

      return new Promise((resolve, reject) => {

        let end = Number.parseInt(num);
        let begin = end - ( goback -1 );
        let promises = [];
        let deployData = [];

        for(let i=begin; i<=end; i++){
          promises.push(this.getDeployBuildJson(String(i)));
        }

        Promise.all(promises).then( values => {

          _.forEach(values, v => {

            let user = determineUserName(v.actions);
            let deployed = determineDeployedTo(v.actions);

            deployData.push({ buildnum : String(v.id), status : v.result,
              startedBy: user, deployDate: config.timestamp_to_date(v.timestamp),deployedTo: deployed });

            });

            resolve(deployData);
        });

      });

  },
  getDevBuildHistory(start, finish) {

      return new Promise((resolve, reject) => {

        let begin = Number.parseInt(start);
        let end = Number.parseInt(finish);
        let promises = [];
        let commitData = [];

        for(let i=begin; i<=end; i++){
          promises.push(this.getDevBuildJson(String(i)));
        }

        Promise.all(promises).then( values => {

          _.forEach(values, v => {

            _.forEach(v.changeSet.items, c => {
                commitData.push({'sha': c.id.slice(0,7), 'comment' : c.comment.slice(0,120),
                  'date': c.date, 'build' : v.id, 'mergedBy' : c.author.fullName });
              });

            });

            resolve(commitData);
        });

      });

  }
}
