var
  // Require necessary npm modules.
  path          = require('path'),
  chalk         = require('chalk'),
  http          = require('http'),
  socketIo      = require('socket.io'),
  nodeStatic    = require('node-static'),

  // Require local modules.
  pkgConfig     = require('./package.json'),
  ServerConfig  = require('./config/server'),
  Server        = require('./src/js/server'),

  // Chalks for logging.
  title         = chalk.bgBlack.white,
  important     = chalk.bgGreen.white,
  comment       = chalk.blue,
  error         = chalk.red,
  processEnv    = process.env,

  // Pretty date stamp.
  date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),

  io,
  port,
  server,
  nodeEnv,
  mainServer,
  serverConfig,
  serverSettings,
  staticServer,
  staticServerTarget,
  staticServerHandler;

console.log(title('====== server-loader start:', date, 'UTC ======'));

// If there is no env, then use development.
if (!processEnv.NODE_ENV) {
  processEnv.NODE_ENV = 'development';
}

nodeEnv         = processEnv.NODE_ENV;
serverConfig    = new ServerConfig(nodeEnv);
serverSettings  = serverConfig.getSettings();

mainServer  = http.createServer();
io          = socketIo(mainServer, { 'transports' : ['websocket'] });
server      = new Server();

// Init server side server for business logic.
server.init(io, processEnv, pkgConfig);

// Create a server for static files.
staticServerTarget  = path.join(__dirname, 'build', serverSettings.SERVDIR);
staticServer        = new nodeStatic.Server(staticServerTarget);
staticServerHandler = function staticServerHandler(req,  res) { console.log('=== Request =====>', req.url); staticServer.serve(req, res); };

mainServer.addListener('request', staticServerHandler);

console.log(comment('=== NodeStatic ==>'), important(staticServerTarget));

port = serverSettings.PORT;

mainServer.on('listening', function () {
  console.log(comment('=== Server ======>'), important('listening on', port));
});

mainServer.on('error',function (e) {
  console.error(error('=== Server ======>'), important(e));
});

mainServer.listen(port, '0.0.0.0');

console.log(comment('=== Server ======>'), important('started on', port));
