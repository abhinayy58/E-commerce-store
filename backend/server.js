import http from 'http';
import app from './app.js';
import ConnectToDb from './db/ConnectToDB.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);


ConnectToDb()
.then(() => {
  server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
});