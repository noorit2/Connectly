import { asyncHandler } from './../utils/asyncHandler';
import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { User } from '../types/user';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';

// Type for promisifyLogin function to handle login promise
const promisifyLogin = (req: Request, user: Express.User): Promise<void> => {
    return new Promise((resolve, reject) => {
        req.login(user, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
});

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId ? parseInt(req.params.userId as string, 10) : null;
    if (!userId) {
        throw new ValidationError('User Id is missing');
    }

    const user = await userModel.getUserById(userId);
    if (!user) {
        throw new NotFoundError(`User with ${userId} couldn't be found`)
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
});

// Get user with communities and connections count
export const getUserByIdWithCommunitiesAndConnectionsCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId ? parseInt(req.params.userId as string, 10) : null;
    if (!userId) {
        throw new ValidationError('Invalid query parameters');
    }

    const user = await userModel.getUserByIdWithCounts(userId);
    if (!user) {
        throw new NotFoundError(`User with ${userId} couldn't be found`)
    }

    res.status(200).json(user);
});

// Get unconnected users with pagination
export const getUnconnectedUserWithLimitAndOffset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.query;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;

    if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError('Invalid query parameters');
    }

    const userId: number = +(req.user as User).id;
    const result = await userModel.countUnconnectedUsers(userId);
    const response = await userModel.findUnConnectedUsers(userId, limitNum, offsetNum);
    const totalPages = Math.ceil(result / limitNum);

    res.status(200).json({ users: response, totalPages });
});

// Get connected users with pagination
export const getconnectedUserWithLimitAndOffset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.query;
    const userId = parseInt(req.params.userId, 10);
    
    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;

    if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError('Invalid query parameters');
    }

    const response = await userModel.findConnectedUsers(userId, limitNum, offsetNum);
    res.status(200).json({ users: response });
});

// Create a new user
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, password, email } = req.body;

    if (!username || !password || !email || !username.trim().length || !password.trim().length || !email.trim().length) {
        throw new ValidationError('Bad request: missing or empty fields');
    } 
    
    const newUser = await userModel.createUser(req.body);
    await promisifyLogin(req, newUser);

    res.status(201).json(newUser);
});

// Create a connection between users
export const createConnection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let user1_id: number = parseInt(req.body.userId, 10);
    let user2_id: number = +(req.user as User).id;

    if (!user1_id) {
        throw new ValidationError('Bad request: missing fields');
    }

    if (user1_id > user2_id) {
        [user1_id, user2_id] = [user2_id, user1_id];
    }

    if (!Number.isInteger(user1_id) || !Number.isInteger(user2_id)) {
        throw new ValidationError('Invalid query parameters');
    }

    const response = await userModel.createConnection(user1_id, user2_id);
    res.status(201).json(response);
});

// Set connection status between users
export const setConnectionStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user1_id, user2_id, status } = req.body;

    const parsedUser1Id = parseInt(user1_id, 10);
    const parsedUser2Id = parseInt(user2_id, 10);

    if (!parsedUser1Id || !parsedUser2Id || !status.trim().length) {
        throw new ValidationError('Bad request: missing fields');
    }

    if (!Number.isInteger(parsedUser1Id) || !Number.isInteger(parsedUser2Id)) {
        throw new ValidationError('Invalid query parameters');
    }

    const response = await userModel.setConnectionStatus(parsedUser1Id, parsedUser2Id, status);
    res.status(201).json(response);
});
 