import { Request, Response } from 'express';
import { communityModel } from '../models/communitiesModel';
import { User } from '../config/passport';
import { getBucket } from '../services/firebaseBucket';

// Define interfaces for request query and body if needed
interface GetCommunitiesQuery {
    limit?: string;
    offset?: string;
    searchWord?: string;
}

interface CreateCommunityBody {
    name: string;
    description: string;
}

interface AddMemberToCommunityBody {
    role: string;
}

export const getCommunities = async (req: Request<{}, {}, {}, GetCommunitiesQuery>, res: Response) => {
    try {
        let { limit, offset, searchWord } = req.query;
        const limitNum = limit ? parseInt(limit as string, 10) : 10; // Default to 10 if not provided
        const offsetNum = offset ? parseInt(offset as string, 10) : 0; // Default to 0 if not provided

        // Validate limit and offset
        if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        let communities;
        if (searchWord) {
            communities = await communityModel.getCommunityByName(searchWord, limitNum, offsetNum);
        } else {
            communities = await communityModel.getCommunitiesLimitedOffset(limitNum, offsetNum);
        }

        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getCommunityById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const community = await communityModel.getCommunityById(parseInt(id, 10));
        if (community) {
            res.status(200).json(community);
        } else {
            res.status(404).json({ message: 'Community not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createCommunity = async (req: Request<{}, {}, CreateCommunityBody>, res: Response) => {
    try {
        const { name, description } = req.body;
        const imageFile = req.file;
        
        if (!name || !description) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }
        
        let imageURL = '';
        if (imageFile) {
            const bucket = await getBucket();
            const blob = bucket.file(`uploads/${Date.now()}-${imageFile.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: imageFile.mimetype
                }
            });

            await new Promise<void>((resolve, reject) => {
                blobStream.on('error', (e) => {
                    reject(e);
                });
                blobStream.on('finish', () => {
                    resolve();
                });
                blobStream.end(imageFile.buffer);
            });

            const [url] = await blob.getSignedUrl({
                action: 'read',
                expires: '01-01-2025'
            });
            imageURL = url;
        }

        const newCommunity = await communityModel.addCommunity(name, description, imageURL);
        res.status(201).json(newCommunity);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getCommunitiesWithMemberCount = async (req: Request<{}, {}, {}, GetCommunitiesQuery>, res: Response) => {
    try {
        let { limit, offset, searchWord } = req.query;
        const limitNum = limit ? parseInt(limit as string, 10) : 10; // Default to 10 if not provided
        const offsetNum = offset ? parseInt(offset as string, 10) : 0; // Default to 0 if not provided

        // Validate limit and offset
        if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        let communities;
        let user: User | null= req.user as User || null;
        let userId = user?+user.id:null;
        if (!searchWord) {
            communities = userId
                ? await communityModel.getCommunitiesWithMemberCountForSignedIn(limitNum, offsetNum, userId)
                : await communityModel.getCommunitiesWithMemberCount(limitNum, offsetNum);
        } else {
            communities = userId
                ? await communityModel.getCommunitiesWithMemberCountAndByNameForSignedIn(searchWord, limitNum, offsetNum, userId)
                : await communityModel.getCommunitiesWithMemberCountAndByName(searchWord, limitNum, offsetNum);
        }
            res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countCommunities = async (req: Request, res: Response) => {
    try {
        const count = await communityModel.countCommunities();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countCommunityMembers = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const members = await communityModel.countCommunityMembers(parseInt(id, 10));
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getCommunityMembers = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const members = await communityModel.getCommunityMembers(parseInt(id, 10));
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUserCommunitiesWithLimitAndOffset = async (req: Request<{ id: string }, {}, {}, GetCommunitiesQuery>, res: Response) => {
    try {
        const { id } = req.params;
        let { limit, offset } = req.query;
        const userId = parseInt(id, 10);
        const limitNum = limit ? parseInt(limit as string, 10) : 10; // Default to 10 if not provided
        const offsetNum = offset ? parseInt(offset as string, 10) : 0; // Default to 0 if not provided

        // Validate limit and offset
        if (isNaN(limitNum) || limitNum < 0 || isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const response = await communityModel.getUserCommunities(userId, limitNum, offsetNum);
        res.status(200).json({ communities: response });

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const addMemberToCommunity = async (req: Request<{ communityId: string; userId: string }, {}, AddMemberToCommunityBody>, res: Response) => {
    try {
        const { communityId, userId } = req.params;
        const { role } = req.body;
        const newMember = await communityModel.addMemberToCommunity(parseInt(communityId, 10), parseInt(userId, 10), role);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
