"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
const pg_1 = require("pg");
let pool;
const getDb = () => {
    if (!pool) {
        pool = new pg_1.Pool({
            connectionString: process.env.POSTGRES_URL,
        });
    }
    return pool;
};
exports.getDb = getDb;
