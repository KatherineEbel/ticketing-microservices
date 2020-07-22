"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stan = void 0;
var node_nats_streaming_1 = require("node-nats-streaming");
var NatsClient = /** @class */ (function () {
    function NatsClient() {
    }
    Object.defineProperty(NatsClient.prototype, "client", {
        get: function () {
            if (!this._stan) {
                throw new Error("Cannot access NATS client before connecting");
            }
            return this._stan;
        },
        enumerable: false,
        configurable: true
    });
    NatsClient.prototype.connect = function (clusterId, clientId, url) {
        var _this = this;
        this._stan = node_nats_streaming_1.connect(clusterId, clientId, { url: url });
        return new Promise(function (resolve, reject) {
            _this._stan.on("connect", function () {
                console.log("Connected to NATS");
                resolve();
            });
            _this._stan.on("error", function (err) { return reject(err); });
        });
    };
    return NatsClient;
}());
exports.stan = new NatsClient();
