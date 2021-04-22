# NAMA FILE: Dockerfile

FROM node:14

WORKDIR /usr/src/app/dumbplay_frontend
COPY . .

RUN npm i
RUN npm run build
RUN sed -i "4s/localhost/api.jouzie.onlinecamp.id/" src/config/api.js
RUN npm install pm2 -g

ENV PM2_PUBLIC_KEY 85belgoexkb9hw6
ENV PM2_SECRET_KEY 8gkopw31moqbhku

EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]
