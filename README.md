Installing dependencies from backend

npm init -y ## inicializating project configurations
npm i typescript @types/node -D ## installing typescrict on dev mode(production off)
npx tsc --init ## inicializating ts config

Acess "ts bases" on github and copy config from your node version

now, version is 20

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "_version": "20.1.0",

  "compilerOptions": {
    "lib": ["es2023"],
    "module": "node16",
    "target": "es2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node16"
  }
}

npm i tsx -D ## its good to run app
npx tsx watch src/server.ts ## command to run app(include this on scripts in dev)

npm i fastify ## framework js to create api( + - express)

npm i prisma -D ## Prisma helps in acess to database.(this technology uses migrations)
npx prisma init --datasource-provider SQLite ## creating database config