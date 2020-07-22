"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var app_1 = require("./app");
var nats_client_1 = require("./nats-client");
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID, JWT_KEY, MONGO_URI, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = process.env, NATS_CLIENT_ID = _a.NATS_CLIENT_ID, NATS_URL = _a.NATS_URL, NATS_CLUSTER_ID = _a.NATS_CLUSTER_ID, JWT_KEY = _a.JWT_KEY, MONGO_URI = _a.MONGO_URI;
                if (!JWT_KEY || !MONGO_URI) {
                    throw new Error('JWT_KEY or MONGO_URI not defined');
                }
                if (!NATS_CLIENT_ID || !NATS_URL || !NATS_CLUSTER_ID) {
                    throw new Error('NATS env not configured');
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, nats_client_1.stan.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)];
            case 2:
                _b.sent();
                nats_client_1.stan.client.on("close", function () {
                    console.log("NATS connection close");
                    process.exit();
                });
                process.on("SIGINT", function () { return nats_client_1.stan.client.close(); });
                process.on("SIGTERM", function () { return nats_client_1.stan.client.close(); });
                return [4 /*yield*/, mongoose_1.default.connect(MONGO_URI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                        useFindAndModify: false,
                    })];
            case 3:
                _b.sent();
                console.log('Mongo connection complete!');
                return [3 /*break*/, 5];
            case 4:
                e_1 = _b.sent();
                console.log('Error connecting to auth database: ', e_1.message);
                return [3 /*break*/, 5];
            case 5:
                app_1.app.listen(3000, function () {
                    console.log('Listening on port 3000!!!');
                });
                return [2 /*return*/];
        }
    });
}); };
start().then(function () { });
