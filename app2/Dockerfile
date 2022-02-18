FROM node:14 as common

WORKDIR /app2

# Development
FROM common as development-stage

ENV NODE_ENV development

CMD ["yarn", "dev"]

# Production 
FROM common as production-stage

ENV NODE_ENV production

CMD ["yarn", "start"]
