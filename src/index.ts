import express, { NextFunction, Request, Response } from 'express';
import { userRouter } from './users/users';

const port = '8000';
const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello Post!');
});

app.use('/users', userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(401).send(err.message);
})

app.listen(port, () => {
    console.log(`I am listening to ${port}:localhost`)
});
