import { pool } from "../config/db";
import bcrypt from "bcrypt";

const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

const getUserById = async (id: number) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const getUserByIdWithCounts = async (id: number) => {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    const connectedCountQuery = `
        SELECT COUNT(*) AS total
        FROM users u
        WHERE u.id != $1
        AND u.id IN (
            SELECT CASE 
            WHEN c.user1_id = $1 THEN c.user2_id
            ELSE c.user1_id
            END
            FROM connections c
            WHERE c.user1_id = $1 OR c.user2_id = $1
        );
    `;
    const connectedCountResult = await pool.query(connectedCountQuery, [id]);

    const joinedCommunitiesCountQuery = `
        SELECT COUNT(DISTINCT c.chat_id) AS total
        FROM chats c
        WHERE c.chat_type = 'community'
        AND c.chat_id IN (
            SELECT chat_id 
            FROM chat_members 
            WHERE user_id = $1
        );
    `;
    const joinedCommunitiesCountResult = await pool.query(joinedCommunitiesCountQuery, [id]);

    return {
        user: userResult.rows[0],
        connectedCount: parseInt(connectedCountResult.rows[0].total, 10),
        joinedCommunitiesCount: parseInt(joinedCommunitiesCountResult.rows[0].total, 10)
    };
};

const createUser = async (user: { username: string; email: string; password: string }) => {
    const { username, email, password } = user;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hash]
    );
    return result.rows[0];
};

const findUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const countUnconnectedUsers = async (userId: number) => {
    const query = `
        SELECT COUNT(*) AS total
        FROM users u
        WHERE u.id != $1
        AND u.id NOT IN (
            SELECT CASE 
            WHEN c.user1_id = $1 THEN c.user2_id
            ELSE c.user1_id
            END
            FROM connections c
            WHERE c.user1_id = $1 OR c.user2_id = $1
        );
    `;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].total, 10);
};

const findUnConnectedUsers = async (userId: number, limit: number, offset: number) => {
    const query = `
        SELECT u.id, u.username
        FROM users u
        WHERE u.id != $1
        AND u.id NOT IN (
            SELECT CASE 
            WHEN c.user1_id = $1 THEN c.user2_id
            ELSE c.user1_id
            END
            FROM connections c
            WHERE c.user1_id = $1 OR c.user2_id = $1
        )
        LIMIT $2
        OFFSET $3;
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
};

const findConnectedUsers = async (userId: number, limit: number, offset: number) => {
    const query = `
        SELECT u.id, u.username
        FROM users u
        WHERE u.id IN (
            SELECT CASE 
            WHEN c.user1_id = $1 THEN c.user2_id
            ELSE c.user1_id
            END
            FROM connections c
            WHERE c.user1_id = $1 OR c.user2_id = $1
        )
        ORDER BY u.id
        LIMIT $2
        OFFSET $3;
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
};

const createConnection = async (user1_id: number, user2_id: number) => {
    const query = `
        INSERT INTO connections (user1_id, user2_id)
        VALUES ($1, $2) RETURNING *;
    `;
    const result = await pool.query(query, [user1_id, user2_id]);
    return result.rows[0];
};

const setConnectionStatus = async (user1_id: number, user2_id: number, status: string) => {
    const query = `
        UPDATE connections
        SET status = $3
        WHERE (user1_id = $1 AND user2_id = $2) 
        OR (user1_id = $2 AND user2_id = $1)
        RETURNING *;
    `;
    const result = await pool.query(query, [user1_id, user2_id, status]);
    return result.rows[0];
};

const validateUserPassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};

export const userModel = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByIdWithCounts,
    findUserByEmail,
    findConnectedUsers,
    validateUserPassword,
    findUnConnectedUsers,
    createConnection,
    setConnectionStatus,
    countUnconnectedUsers
};
