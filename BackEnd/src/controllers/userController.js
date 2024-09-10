
import { userModel } from "../models/userModel.js";

const promisifyLogin = (req, user) => {
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

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        console.log(req.params.userId,req.params);
        const user = await userModel.getUserById(req.params.userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserByIdWithCommunitiesAndConnectionsCount = async (req, res) => {
    try {
        console.log(req.params.userId,req.params,"ewww");
        const user = await userModel.getUserByIdWithCounts(req.params.userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getUnconnectedUserWithLimitAndOffset = async (req, res) => {
    try {
        let { limit, offset } = req.query;
        // Convert limit and offset to integers
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);
        // Validate limit and offset
        if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(offset)) {
            return res.status(400).json({message: "Invalid query parameters"});
        }
        console.log(req.user);
        const result = await userModel.countUnconnectedUsers(req.user.id);
        const response = await userModel.findUnConnectedUsers(req.user.id,limit,offset);
        const totalPages = Math.ceil(result / limit);
        res.status(200).json({users:response,totalPages:totalPages});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getconnectedUserWithLimitAndOffset = async (req, res) => {
    try {
        let { limit, offset } = req.query;
        let userId = parseInt(req.params.userId);
        console.log(limit,offset,userId);
        // Convert limit and offset to integers
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);
        // Validate limit and offset
        if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(offset) || !Number.isInteger(userId)) {
            return res.status(400).json({message: "Invalid query parameters"});
        }
        const response = await userModel.findConnectedUsers(userId,limit,offset);
        res.status(200).json({users:response});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const createUser = async (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.email){
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }
    if(!req.body.username.trim().length > 0 || !req.body.password.trim().length > 0  || !req.body.email.trim().length > 0 ){
        return res.status(400).json({ error: 'Bad request: fields cannot be empty' });    }
    try {
        const newUser = await userModel.createUser(req.body);
        await promisifyLogin(req,newUser);
        console.log(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createConnection = async (req,res) =>{
    console.log("in create");
    if(!req.body.userId){
        console.log(req.body);
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }
   let  user1_id = parseInt(req.body.userId , 10);
   let user2_id = req.user.id;
   if(user1_id > user2_id){
    let temp;
    temp = user1_id;
    user1_id = user2_id;
    user2_id = temp;
   }
    // Validate limit and offset
    if (!Number.isInteger(user1_id) ||  !Number.isInteger(user2_id)) {
        return res.status(400).json({message: "Invalid query parameters"});
    }
    try{
        const response = await userModel.createConnection(user1_id,user2_id);
        res.status(201).json(response);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const setConnectionStatus = async (req,res) => {
    if(!req.body.user1_id || !req.body.user2_id || !req.body.status){
        return res.status(400).json({ error: 'Bad request: missing fields' });
    }
   let  user1_id = parseInt(req.body.user1_id , 10);
   let  user2_id = parseInt(req.body.user2_id, 10);
   let status = req.body.status;
    // Validate limit and offset
    if (!Number.isInteger(user1_id) || limit < 0 || !Number.isInteger(user2_id) || status.trim().length === 0) {
        return res.status(400).json({message: "Invalid query parameters"});
    }
    try{
        const response = await userModel.setConnectionStatus(user1_id,user2_id,status);
        res.status(201).json(response);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


