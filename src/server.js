"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const create_trip_1 = require("./routes/create-trip");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const app = (0, fastify_1.default)();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(create_trip_1.createTrip);
app.listen({ port: 3333 }).then(() => {
    console.log("Server running");
});
