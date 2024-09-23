import * as express from "express-serve-static-core";
import { User } from './user';
declare global{
    namespace express{
        interface Request{
            user: User;
        }
    }
}