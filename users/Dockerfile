FROM node:16.8.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# CMD ["npm", "start"]
CMD ["npm", "run", "start-dev"]