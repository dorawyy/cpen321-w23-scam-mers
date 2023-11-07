# RunIO


`sudo docker run -d -p 27017:27017 --name runio-db -v runio-data:/data/db mongo:latest`    

To restart mongodb:
`sudo docker restart runio-db`

To run server in background, run comand in backend directory:

`pm2 start server.js`, `pm2 stop server.js`

To run server:
`node server.js` in backend directory

Installing NVM on Ubuntu:<br>
`sudo apt update`<br>
`sudo apt install curl git` <br>
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash` <br>
`source ~/.bashrc` <br>
`nvm --version` <br>
`nvm install --lts` <br>

Command to get gradle signing report: <br>
`./gradlew signingReport`

Things to keep in mind:<br>
Does allowing location while using the app solve our purpose? Does it work in the background?
