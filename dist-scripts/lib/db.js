"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
var pg_1 = require("pg");
var pool;
var getDb = function () {
    if (!pool) {
        pool = new pg_1.Pool({
            connectionString: process.env.POSTGRES_URL,
        });
    }
    return pool;
};
exports.getDb = getDb;
