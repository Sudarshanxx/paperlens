
FROM node:18-alpine
 
WORKDIR /app
 
COPY package*.json ./
RUN npm install
 
COPY prisma ./prisma
RUN npx prisma generate
 
COPY . .
RUN npm run build
 
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
 
CMD ["npm", "start"]
 