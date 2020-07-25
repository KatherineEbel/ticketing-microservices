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
exports.TicketCreatedPublisher = void 0;
var base_publisher_1 = require("./base-publisher");
var subject_1 = require("./subject");
var TicketCreatedPublisher = /** @class */ (function (_super) {
    __extends(TicketCreatedPublisher, _super);
    function TicketCreatedPublisher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subject = subject_1.Subject.TicketCreated;
        return _this;
    }
    return TicketCreatedPublisher;
}(base_publisher_1.Publisher));
exports.TicketCreatedPublisher = TicketCreatedPublisher;