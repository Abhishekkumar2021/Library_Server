"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const ErrorHandler_1 = __importDefault(require("./middlewares/ErrorHandler"));
// Load environment variables
dotenv_1.default.config();
const env = process.env;
const port = parseInt(env.PORT) || 3000;
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB & start server
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(env.MONGO_URI)
    .then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})
    .catch(err => {
    console.log(err.message);
});
// Configure Express with middlewares
const corsOptions = {
    origin: env.CLIENT_URL,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', AuthRoutes_1.default);
// Routes & Controllers
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Error handling
app.use(ErrorHandler_1.default);
