import express from "express";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
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
} from "../controllers/communitiesController.js";
import { upload } from "../services/firebaseBucket.js";

const router = express.Router();

// Create a new community
router.post('/', ensureAuthenticated, upload.single('image') ,createCommunity);


// add member to a community
router.post('/:communityId/members/:userId',ensureAuthenticated,addMemberToCommunity);

router.get('/:id/membersCount',countCommunityMembers);

router.get('/with-member-count', getCommunitiesWithMemberCount);

// Get all communities with pagination and optional search
router.get('/', getCommunities);

// Count total number of communities
router.get('/count', countCommunities);


// Get a community by ID
router.get('/:id', getCommunityById);

// Get members of a specific community
router.get('/:id/members', getCommunityMembers);
// get number of community members
 
// get all communities that user is part of 
router.get("/:id/communities", getUserCommunitiesWithLimitAndOffset);

export default router;


export const communityRoutes = router;
