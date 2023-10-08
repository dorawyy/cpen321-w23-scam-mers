# RunIO


`sudo docker run -d -p 27017:27017 --name runio-db -v runio-data:/data/db mongo:latest`

To run server in background, run comand in backend directory:

`pm2 start server.js`, `pm2 stop server.js`
