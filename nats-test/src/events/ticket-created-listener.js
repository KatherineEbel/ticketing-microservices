"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCreatedListener = void 0;
var base_listener_1 = require("./base-listener");
var subject_1 = require("./subject");
var TicketCreatedListener = /** @class */ (function (_super) {
    __extends(TicketCreatedListener, _super);
    function TicketCreatedListener() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queueGroupName = "payments-service";
        _this.subject = subject_1.Subject.TicketCreated;
        return _this;
    }
    TicketCreatedListener.prototype.onMessage = function (data, msg) {
        console.log("Got event with data/n:", data);
        msg.ack();
    };
    return TicketCreatedListener;
}(base_listener_1.Listener));
exports.TicketCreatedListener = TicketCreatedListener;
