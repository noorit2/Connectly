import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { User } from "../config/passport";

// Type for promisifyLogin function to handle login promise
const promisifyLogin = (req: Request, user: Express.User): Promise<void> => {
    return new Promise((resolve, reject) => {
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve();
        });
    });
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const userId = req.params.userId?parseInt(req.params.userId as string, 10):null ;
        if(!userId){
            return res.status(400).json({ message: "Invalid query parameters" });
        }
        const user = await userModel.getUserById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get user with communities and connections count
export const getUserByIdWithCommunitiesAndConnectionsCount = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const userId = req.params.userId?parseInt(req.params.userId as string, 10):null ;
        if(!userId){
            return res.status(400).json({ message: "Invalid query parameters" });
        }
        const user = await userModel.getUserByIdWithCounts(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get unconnected users with pagination
export const getUnconnectedUserWithLimitAndOffset = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        let { limit, offset } = req.query;
        const limitNum = limit ? parseInt(limit as string, 10) : 10; // Default to 10 if not provided
        const offsetNum = offset ? parseInt(offset as string, 10) : 0; // Default to 0 if not provided

        // Validate limit and offset
        if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const userId:number = +(req.user as User).id;
        const result = await userModel.countUnconnectedUsers(userId);
        const response = await userModel.findUnConnectedUsers(userId, limitNum, offsetNum);
        const totalPages = Math.ceil(result / limitNum);
        res.status(200).json({ users: response, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get connected users with pagination
export const getconnectedUserWithLimitAndOffset = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        let { limit, offset } = req.query;
        let userId = parseInt(req.params.userId, 10);
        console.log(limit, offset, userId);

        const limitNum = limit ? parseInt(limit as string, 10) : 10; // Default to 10 if not provided
        const offsetNum = offset ? parseInt(offset as string, 10) : 0; // Default to 0 if not provided

        // Validate limit and offset
        if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const response = await userModel.findConnectedUsers(userId, limitNum, offsetNum);
        res.status(200).json({ users: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }

    if (!username.trim().length || !password.trim().length || !email.trim().length) {
        return res.status(400).json({ error: 'Bad request: fields cannot be empty' });
    }

    try {
        const newUser = await userModel.createUser(req.body);
        await promisifyLogin(req, newUser);
        console.log(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a connection between users
export const createConnection = async (req: Request, res: Response): Promise<Response | void> => {
    console.log("in create");

    let user1_id:number = parseInt(req.body.userId, 10);
    let user2_id:number = +(req.user as User).id;

    if (!user1_id) {
        console.log(req.body);
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }

    if (user1_id > user2_id) {
        [user1_id, user2_id] = [user2_id, user1_id];
    }

    if (!Number.isInteger(user1_id) || !Number.isInteger(user2_id)) {
        return res.status(400).json({ message: "Invalid query parameters" });
    }

    try {
        const response = await userModel.createConnection(user1_id, user2_id);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Set connection status between users
export const setConnectionStatus = async (req: Request, res: Response): Promise<Response | void> => {
    const { user1_id, user2_id, status } = req.body;

    const parsedUser1Id = parseInt(user1_id, 10);
    const parsedUser2Id = parseInt(user2_id, 10);

    if (!parsedUser1Id || !parsedUser2Id || !status.trim().length) {
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }

    if (!Number.isInteger(parsedUser1Id) || !Number.isInteger(parsedUser2Id)) {
        return res.status(400).json({ message: "Invalid query parameters" });
    }

    try {
        const response = await userModel.setConnectionStatus(parsedUser1Id, parsedUser2Id, status);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
