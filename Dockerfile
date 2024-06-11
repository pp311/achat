FROM node:lts-alpine
# Define build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_KEY
ARG VITE_FACEBOOK_APP_ID
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_CONNECT_CLIENT_ID

# Set environment variables during the build process
ENV VITE_API_URL=https://achat-api.whitemage.fun/api
ENV VITE_API_BASE_URL=https://achat-api.whitemage.fun
ENV VITE_FACEBOOK_APP_ID=1112531290010177
ENV VITE_GOOGLE_CLIENT_ID=35933257036-qto3kbo0s1f0702skb4ekaoero4c5qi8.apps.googleusercontent.com
ENV VITE_GOOGLE_CONNECT_CLIENT_ID=35933257036-qto3kbo0s1f0702skb4ekaoero4c5qi8.apps.googleusercontent.com
# install simple http server for serving static content
RUN npm install -g http-server
# make the 'app' folder the current working directory
WORKDIR /app
# copy 'package.json' to install dependencies
COPY package*.json ./
# install dependencies
RUN npm install
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN npm run build-only
EXPOSE 8080
CMD [ "http-server", "-P http://localhost:8080?" , "dist" ]
