// Imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
app.use(cors());
app.use(bodyParser.json());

// Routes & Controllers
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err.message);
    res.status(500).send('Something broke!');
});





