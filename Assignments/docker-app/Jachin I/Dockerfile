FROM node

RUN mkdir /home/app
RUN git clone https://github.com/vj-abishek/facetime-server.git /home/app

WORKDIR /home/app
RUN npm install

EXPOSE 3030
CMD ["npm", "start"]
