const http = require('http');
const app  = require('./app');
const { initSocket }       = require('./socket');
const { initCronJobs }     = require('./cron/jobs');
const { testConnectivity } = require('./services/judge0ce.service');
require('dotenv').config();

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, async () => {
  console.log(`\n Server running on port ${PORT}`);
  console.log(`   Mode    : ${process.env.NODE_ENV}`);
  console.log(`   API URL : http://localhost:${PORT}/api\n`);

  await testConnectivity();

  if (process.env.NODE_ENV !== 'test') {
    initCronJobs();
  }
});


process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});