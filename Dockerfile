# NAMA FILE: Dockerfile

FROM node:14

WORKDIR /usr/src/app/dumbplay_frontend
COPY . .

RUN npm i
RUN npm run build
RUN sed -i "4s/localhost/api.jouzie.onlinecamp.id/" src/config/api.js

EXPOSE 3000
CMD ["npm","start"]
