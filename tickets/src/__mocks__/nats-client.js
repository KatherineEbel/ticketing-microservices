"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stan = void 0;
exports.stan = {
    client: {
        publish: jest.fn().mockImplementation(function (subject, data, callback) {
            callback();
        })
    }
};
