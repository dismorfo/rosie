FROM node:8

RUN apt-get update -qq && apt-get install -y build-essential

# Set the working directory to /app
WORKDIR /app

ADD package.json .

# Copy the current directory contents into the container at /app
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install

RUN npm rebuild node-sass

ADD . .

EXPOSE 8080

CMD [ "npm", "start" ]

