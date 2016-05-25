FROM node:4-onbuild

COPY package.json /src/package.json
RUN cd /src; npm install --production
ADD public /src/public/
ADD server.js /src/

EXPOSE 8080
CMD ["node", "/src/server.js"]