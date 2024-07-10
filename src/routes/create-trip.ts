import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from "zod"
import { prisma } from "../lib/prisma";

export async function createTrip(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips',{
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),//convert string date do date date.
                ends_at: z.coerce.date()//convert string date do date date.
            })
        }
    } ,async (request) => {
       const { destination, starts_at, ends_at } = request.body

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at
            }
        });

       return { tripId : trip.id };
    })
}