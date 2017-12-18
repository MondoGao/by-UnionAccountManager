const defaultSettings = {
  apiPublicPath: 'v1.0/',
  publicPath: '/',
  port: 8080,
};

module.exports = {
  defaultSettings,
  apiPublicPath: process.env.API_PUBLIC_PATH || defaultSettings.apiPublicPath,
  publicPath: process.env.PUBLIC_PATH || defaultSettings.publicPath,
  port: process.env.PORT || defaultSettings.port,
};
