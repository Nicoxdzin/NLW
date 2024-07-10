import fastify from "fastify";
import { prisma } from "./lib/prisma";

const app = fastify();

app.get('/teste', () => {
    return "Hello World"
});

app.get('/cadastrar', async () => {
    await prisma.trip.create({
        data: {
            destination : 'Florianopolis',
            ends_at : new Date(),
            starts_at: new Date(),
        }
    })
    return "Registro cadastrado com sucesso!"
});

app.get('/listar', async () => {
    const trips = await prisma.trip.findMany()
    return trips
});

app.listen({ port: 3333 }).then(() => {
console.log("Server running")
});