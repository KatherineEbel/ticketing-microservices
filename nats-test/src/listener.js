"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_nats_streaming_1 = require("node-nats-streaming");
var crypto_1 = require("crypto");
var ticket_created_listener_1 = require("./events/ticket-created-listener");
console.clear();
// k port-forward nats-depl-67cbfbc6c5-lgcdn 8222:8222
var stan = node_nats_streaming_1.connect("ticketing", crypto_1.randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
});
stan.on("connect", function () {
    console.log("Listener connected to NATS");
    stan.on("close", function () {
        console.log("NATS connection closed");
        process.exit();
    });
    new ticket_created_listener_1.TicketCreatedListener(stan).listen();
});
process.on("SIGINT", function () { return stan.close(); });
process.on("SIGTERM", function () { return stan.close(); });
