import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from "zod"
import { prisma } from "../lib/prisma";
import nodemailer from 'nodemailer'
import { getMailClient } from "../lib/mail";
import dayjs from "dayjs";


export async function createTrip(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips',{
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),//convert string date do date date.
                ends_at: z.coerce.date(),//convert string date do date date.
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email())
            })
        }
    } ,async (request) => {
       const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body

       if(dayjs(starts_at).isBefore(new Date())){
        throw new Error('Invalid trip starts date')
       }

       if(dayjs(ends_at).isBefore(starts_at)){
        throw new Error('Invalid trip starts date. Start date is after end date.')
       }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participant: {
                    createMany: {
                        data: [
                            {
                            name: owner_name,
                            email: owner_email,
                            is_owner: true,
                            is_confirmed: true,
                            },
                            ...emails_to_invite.map(email => {
                                return { email }
                            })
                        ],
                    }
                }
            }
        });

        const formatted_start_date = dayjs(starts_at).format('LL')
        const formatted_end_date = dayjs(ends_at).format('LL')

        const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`

        const mail = await getMailClient()

        const message = await mail.sendMail({
            from: {
            name:"Equipe plann.er",
            address: "oi@plann.er"
            },
            to: {
                name: owner_name,
                address: owner_email
            },
            subject: `Confirme sua viagem para ${trip.destination}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formatted_start_date}</strong> até <strong>${formatted_end_date}</strong>.</p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink}">Confirmar viagem</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>`.trim()
        })

        console.log(nodemailer.getTestMessageUrl(message))

       return { tripId : trip.id };
    })
}