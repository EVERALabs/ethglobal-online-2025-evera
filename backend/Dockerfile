############
### BASE ###
############
# Stage 0: Define the base image
FROM node:20-bullseye AS base
WORKDIR /usr/src/app

############
### DEPS ###
############
# Stage 1: Install the dependencies for build, needs to install the dev dependencies
FROM base AS install
COPY package.json package-lock.json ./
RUN npm i

#############
### BUILD ###
#############
# Stage 2: Build the application
FROM base AS builder
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

##############
### RUNNER ###
##############
# Stage 3: Create the final image
FROM base AS runner
COPY --from=builder /usr/src/app/prisma prisma
COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/dist dist

EXPOSE 3001
CMD ["node", "/usr/src/app/dist/main.js"]