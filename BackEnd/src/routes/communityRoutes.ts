import express, { Request, Response, NextFunction } from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { 
    createCommunity, 
    getCommunities, 
    getCommunityById, 
    countCommunities,
    getCommunityMembers, 
    countCommunityMembers,
    addMemberToCommunity,
    getCommunitiesWithMemberCount,
    getUserCommunitiesWithLimitAndOffset
} from '../controllers/communitiesController';
import { upload } from '../services/firebaseBucket';

const router = express.Router();

// Create a new community
router.post(
    '/', 
    ensureAuthenticated, 
    upload.single('image'), 
    (req: Request, res: Response, next: NextFunction) => createCommunity(req, res)
);

// Add member to a community
router.post(
    '/:communityId/members/:userId',
    ensureAuthenticated, 
    addMemberToCommunity
);

// Get count of members in a community
router.get(
    '/:id/membersCount',
   countCommunityMembers
);

// Get communities with member count
router.get(
    '/with-member-count',
    (req: Request, res: Response, next: NextFunction) => getCommunitiesWithMemberCount(req, res)
);

// Get all communities with optional search and pagination
router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => getCommunities(req, res)
);

// Count total number of communities
router.get(
    '/count',
    (req: Request, res: Response, next: NextFunction) => countCommunities(req, res)
);

// Get a community by ID
router.get(
    '/:id',
    getCommunityById
);

// Get members of a specific community
router.get(
    '/:id/members',
    getCommunityMembers
);

// Get all communities that user is part of
router.get(
    '/:id/communities',
    getUserCommunitiesWithLimitAndOffset
);

export default router;
export const communityRoutes = router;
