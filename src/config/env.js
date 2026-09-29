require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'AWS SSM Manager',
  awsRegion: process.env.AWS_REGION || '',
  ssmPath: process.env.SSM_PATH || '/',
};
