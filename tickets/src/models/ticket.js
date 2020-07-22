"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
// @ts-ignore
var mongoose_1 = __importDefault(require("mongoose"));
var ticketSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
});
ticketSchema.statics.build = function (attrs) {
    return new Ticket(attrs);
};
var Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.Ticket = Ticket;
