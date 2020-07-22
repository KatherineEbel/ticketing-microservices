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
exports.TicketUpdatedPublisher = void 0;
var common_1 = require("@ke-tickets/common");
var TicketUpdatedPublisher = /** @class */ (function (_super) {
    __extends(TicketUpdatedPublisher, _super);
    function TicketUpdatedPublisher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subject = common_1.Subject.TicketUpdated;
        return _this;
    }
    return TicketUpdatedPublisher;
}(common_1.Publisher));
exports.TicketUpdatedPublisher = TicketUpdatedPublisher;
