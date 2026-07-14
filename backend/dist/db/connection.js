"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ai_doc_intelligence',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
};
const pool = new pg_1.Pool(poolConfig);
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
const query = (text, params) => {
    return pool.query(text, params);
};
exports.query = query;
const getClient = () => {
    return pool.connect();
};
exports.getClient = getClient;
exports.default = pool;
//# sourceMappingURL=connection.js.map