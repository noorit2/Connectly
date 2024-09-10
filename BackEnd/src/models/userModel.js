import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

 const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

 const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};
const getUserByIdWithCounts = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const count = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users u
    WHERE u.id != $1
    AND u.id  IN (
        SELECT CASE 
        WHEN c.user1_id = $1 THEN c.user2_id
        ELSE c.user1_id
        END
        FROM connections c
        WHERE c.user1_id = $1 OR c.user2_id = $1
    );
`, [id]);
const countQuery = `
SELECT COUNT(DISTINCT c.chat_id) AS total
FROM chats c
WHERE c.chat_type = 'community'
AND c.chat_id  IN (
    SELECT chat_id 
    FROM chat_members 
    WHERE user_id = $1
)
`;

const countResponse = await pool.query(countQuery, [id]);

    return {user:result.rows[0],connectedCount:count.rows[0],joinedCommunitiesCount:countResponse.rows[0]};
};

 const createUser = async (user) => {
    const { username, email, password } = user;
    
    const hash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hash]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const countUnconnectedUsers = async (userId) => {
    const result = await pool.query(`
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
    `, [userId]);
    return parseInt(result.rows[0].total, 10);
};

const findUnConnectedUsers = async (userId,limit,offset) =>{
const result = await pool.query(`SELECT u.id, u.username
FROM users u
WHERE u.id != $1
AND u.id NOT IN (
    SELECT CASE 
    WHEN c.user1_id = $1 THEN c.user2_id
    ELSE c.user1_id
    END
    FROM connections c
    WHERE c.user1_id = $1 OR c.user2_id = $1
    limit $2
    offset $3
);`, [userId,limit,offset]);
return result.rows;
}

const findConnectedUsers = async (userId,limit,offset) =>{
    const result = await pool.query(`SELECT u.id, u.username
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
    OFFSET $3;`, [userId,limit,offset]);
    return result.rows;
    }

const createConnection = async (user1_id,user2_id) =>{
    const result = await pool.query(`INSERT INTO connections (user1_id, user2_id)
    VALUES ($1,$2) returning *;`,[user1_id,user2_id]);
    return result.rows[0];
}
const setConnectionStatus = async (user1_id,user2_id,status) =>{
    const result = await pool.query(`UPDATE connections
    SET status = $3
    WHERE (user1_id = $1 AND user2_id = 2) OR (user1_id = $2 AND user2_id = $1) returing *;`,[user1_id,user2_id,status]);
    return result.rows[0];
}
const validateUserPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export const userModel = {
    createUser,getAllUsers,getUserById,getUserByIdWithCounts,findUserByEmail,findConnectedUsers,validateUserPassword,findUnConnectedUsers,createConnection,setConnectionStatus,findUnConnectedUsers,countUnconnectedUsers
};
