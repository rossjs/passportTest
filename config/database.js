const username = process.env.DB_USER;
const password = process.env.DB_PASS;

module.exports = {
  url: `mongodb://${username}:${password}>@ds119355.mlab.com:19355/passport-test`
};
