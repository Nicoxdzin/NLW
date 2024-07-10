"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrip = createTrip;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function createTrip(app) {
    app.withTypeProvider().post('/trips', {
        schema: {
            body: zod_1.z.object({
                destination: zod_1.z.string().min(4),
                starts_at: zod_1.z.coerce.date(), //convert string date do date date.
                ends_at: zod_1.z.coerce.date() //convert string date do date date.
            })
        }
    }, async (request) => {
        const { destination, starts_at, ends_at } = request.body;
        const trip = await prisma_1.prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at
            }
        });
        return { tripId: trip.id };
    });
}
