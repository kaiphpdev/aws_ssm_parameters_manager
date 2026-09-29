const app = require('./app');
const env = require('./config/env');

app.listen(env.port, env.host, () => {
  console.log(`${env.appName}: http://${env.host}:${env.port}/ssm`);
});
