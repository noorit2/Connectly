import { pool } from "../config/db.js";

const getCommunitiesLimitedOffset = async (limit,offset) => {
 const response = await pool.query("SELECT * FROM chats WHERE chat_type = 'community'  ORDER BY chat_id LIMIT $1 OFFSET $2;",[
    limit,offset
 ]);
 return response.rows;
}
const getCommunityById = async (id) => {
    const response = await pool.query("SELECT * FROM chats where chat_id = $1 AND chat_type = 'community'",[
        id
    ]);
    return response.rows[0];
   }
const getCommunityByName = async (searchWord,limit,offset) => {
    const response = await pool.query("SELECT * FROM chats where chat_name ILIKE $1 AND chat_type = 'community' LIMIT $1 OFFSET $2",[
        `%${searchWord}%`,limit,offset
    ]);
    return response.rows;
}
const getCommunityMembers = async (communityId) => {
    const response = await pool.query(
        `SELECT u.user_id, u.username, cm.role 
         FROM chat_members cm
         JOIN users u ON cm.user_id = u.user_id
         WHERE cm.chat_id = $1`,
        [communityId]
    );
    return response.rows;
};
export const getCommunitiesWithMemberCount = async (limit, offset) => {
    const response = await pool.query(`
        SELECT c.chat_id, c.chat_name,c.chat_description,c.chat_image,c.created_at, COUNT(cm.user_id) AS member_count
        FROM chats c
        LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
        WHERE c.chat_type = 'community'
        GROUP BY c.chat_id, c.chat_name
        ORDER BY c.chat_id
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    const countQuery = `
    SELECT COUNT(DISTINCT c.chat_id) AS total_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community'
`;
const countResponse = await pool.query(countQuery);

const totalCount = countResponse.rows[0].total_count;
const totalPages = Math.ceil(totalCount / limit);

return {
    communities: response.rows,
    totalPages,
    totalCount
};
};
export const getCommunitiesWithMemberCountForSignedIn = async (limit, offset,userId) => {
    const response = await pool.query(`
    SELECT c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at, 
           COALESCE(COUNT(cm.user_id), 0) AS member_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community' 
    AND c.chat_id NOT IN (
        SELECT chat_id 
        FROM chat_members 
        WHERE user_id = $1
    )
    GROUP BY c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at
    ORDER BY c.chat_id
    LIMIT $2 OFFSET $3
`, [userId,limit, offset]);
const countQuery = `
SELECT COUNT(DISTINCT c.chat_id) AS total_count
FROM chats c
WHERE c.chat_type = 'community'
AND c.chat_id NOT IN (
    SELECT chat_id 
    FROM chat_members 
    WHERE user_id = $1
)
`;

const countResponse = await pool.query(countQuery, [userId]);

const totalCount = countResponse.rows[0].total_count;
const totalPages = Math.ceil(totalCount / limit);
console.log(totalCount,totalPages,limit);
return {
    communities: response.rows,
    totalPages,
    totalCount
};
};
export const getCommunitiesWithMemberCountAndByName = async (searchWord,limit, offset) => {

    const response = await pool.query(`
        SELECT c.chat_id, c.chat_name,c.chat_description,c.chat_image,c.created_at, COUNT(cm.user_id) AS member_count
        FROM chats c
        LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
        WHERE c.chat_type = 'community' AND c.chat_name ILIKE $1
        GROUP BY c.chat_id, c.chat_name
        ORDER BY c.chat_id
        LIMIT $2 OFFSET $3
    `, [searchWord,limit, offset]);

    const countQuery = `
    SELECT COUNT(DISTINCT c.chat_id) AS total_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community' 
    AND c.chat_name ILIKE $1 
    AND c.chat_id NOT IN (
        SELECT chat_id 
        FROM chat_members 
        WHERE user_id = $1
    )
    `;
const countResponse = await pool.query(countQuery, [searchWord,userId]);

const totalCount = countResponse.rows[0].total_count;
const totalPages = Math.ceil(totalCount / limit);

return {
    communities: response.rows,
    totalPages,
    totalCount
};
};

export const getCommunitiesWithMemberCountAndByNameForSignedIn = async (searchWord,limit, offset,userId) => {
    const response = await pool.query(`
    SELECT c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at, 
           COALESCE(COUNT(cm.user_id), 0) AS member_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community' 
    AND c.chat_name ILIKE $1
    AND c.chat_id NOT IN (
        SELECT chat_id 
        FROM chat_members 
        WHERE user_id = $2
    )
    GROUP BY c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at
    ORDER BY c.chat_id
    LIMIT $3 OFFSET $4
`, [searchWord,userId,limit, offset]);

    const countQuery = `
    SELECT COUNT(DISTINCT c.chat_id) AS total_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community' AND c.chat_name ILIKE $1  AND c.chat_id NOT IN (
        SELECT chat_id 
        FROM chat_members 
        WHERE user_id = $2
    )
    `;
const countResponse = await pool.query(countQuery, [searchWord,userId]);

const totalCount = countResponse.rows[0].total_count;
const totalPages = Math.ceil(totalCount / limit);
console.log(totalCount,totalPages);
return {
    communities: response.rows,
    totalPages,
    totalCount
};
};

const getUserCommunities = async (id,limit,offset) => {
    const response = await pool.query(`
    SELECT c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at, 
           COALESCE(COUNT(cm.user_id), 0) AS member_count
    FROM chats c
    LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id
    WHERE c.chat_type = 'community' 
    AND c.chat_id  IN (
        SELECT chat_id 
        FROM chat_members 
        WHERE user_id = $1
    )
    GROUP BY c.chat_id, c.chat_name, c.chat_description, c.chat_image, c.created_at
    ORDER BY c.chat_id
    LIMIT $2 OFFSET $3
`, [id,limit, offset]);
return response.rows;
}

const addCommunity = async (name,description,image) => {
    console.log(image);
    const response = await pool.query("INSERT INTO chats (chat_name,chat_description,chat_image,chat_type,is_group) values ($1,$2,$3,$4,$5) RETURNING *",[
        name,description,image,'community',true
    ]);
    return response.rows[0];
}
const addMemberToCommunity = async (communityId, userId, role = 'member') => {
    const response = await pool.query(
        "INSERT INTO chat_members (chat_id, user_id, role) VALUES ($1, $2, $3) RETURNING *",
        [communityId, userId, role]
    );
    return response.rows[0];
};
const countCommunities = async () => {
    const response = await pool.query(
        "SELECT COUNT(*) FROM chats WHERE chat_type = 'community'"
    );
    return parseInt(response.rows[0].count, 10);
};
const countCommunityMembers = async (communityId) => {
    const response = await pool.query(
        "SELECT COUNT(*) FROM chat_members WHERE chat_id = $1",
        [communityId]
    );
    return parseInt(response.rows[0].count, 10);
};


export const communityModel = {
    getCommunitiesLimitedOffset,getCommunityById,getUserCommunities,getCommunityByName,getCommunityMembers,getCommunitiesWithMemberCount,getCommunitiesWithMemberCountForSignedIn,getCommunitiesWithMemberCountAndByName,getCommunitiesWithMemberCountAndByNameForSignedIn,addCommunity,addMemberToCommunity,countCommunities,countCommunityMembers
}