// Imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthRoutes from './routes/AuthRoutes';
import errorHandler from './middlewares/ErrorHandler';

// Load environment variables
dotenv.config();
const env = process.env;
const port: number = parseInt(env.PORT as string) || 3000;

// Create Express app
const app = express();

// Connect to MongoDB & start server
mongoose.set('strictQuery', false);
mongoose.connect(env.MONGO_URI as string)
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
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', AuthRoutes);

// Routes & Controllers
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

// Error handling
app.use(errorHandler);





