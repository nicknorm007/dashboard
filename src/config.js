import ColorHash from 'color-hash';
import moment from 'moment';

var config = {

  envs: ['dev', 'qa', 'stg', 'prod'],

  success : "SUCCESS",
  fail : "FAILED",
  view_changes_btn_text : "View Changes",

  httpsPrefix: 'https://',

  appDomain : ".com",

  appUrlPrefix: {'dev' : 'dev-', 'qa' : 'qa-',
    'stg' : 'stg-', 'prod' : ''},

  timestamp_to_date(stamp){
    return moment.unix(stamp / 1000).format("DD MMM YYYY hh:mm a")
  },

  getHSLAFromString(str) {
    let colorHash = new ColorHash({saturation: 1, lightness: 0.5});
    let hsl = colorHash.hsl(str);
    return 'hsla(' + hsl[0] + ', 80%, 50%, 0.1)';
  },
  getRandomSuffix(n=3){

    return Math.random().toString().slice(2, n+2);

  },
  deployJobUrl : "https://jenkins.",
  devBranchBuilds : "https://jenkins."


}
export default config;
