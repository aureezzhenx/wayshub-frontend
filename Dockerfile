# NAMA FILE: Dockerfile

FROM node:14

WORKDIR /usr/src/app/dumbplay_frontend
COPY . .

RUN npm i
RUN npm run build
RUN sed -i "4s/localhost/api.jouzie.onlinecamp.id/" src/config/api.js

RUN npm install pm2 -g
RUN pm2 start ecosystem.config.js
RUN pm2 link 8gkopw31moqbhku 85belgoexkb9hw6

EXPOSE 3000
