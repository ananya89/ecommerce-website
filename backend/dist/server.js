"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const envelope_1 = require("./utils/envelope");
const notFound_1 = require("./middleware/notFound");
const errorHandler_1 = require("./middleware/errorHandler");
async function mainEntryFunction() {
    await (0, db_1.connectDB)();
    const app = (0, express_1.default)();
    const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
        .split(',').map(origin => origin.trim()).filter(Boolean);
    app.use((0, cors_1.default)({
        origin: corsOrigins,
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)('dev'));
    app.get("/health", (_req, res) => {
        res.status(200).json((0, envelope_1.ok)({ message: "Server is healthy/in running state" }));
    });
    app.use(notFound_1.notFound);
    app.use(errorHandler_1.errorHandler);
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is listening to port ${port}`);
    });
}
mainEntryFunction().catch((err) => {
    console.error("failed to start", err);
    process.exit(1);
});
