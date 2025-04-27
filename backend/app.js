import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/v1/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!!');
});


export default app