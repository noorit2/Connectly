import { asyncHandler } from './../utils/asyncHandler';
import { Request, Response } from 'express';
import { communityModel } from '../models/communitiesModel';
import { User } from '../types/user';
import { uploadToFirebase } from '../services/firebaseBucket';
import { CreateCommunityBody } from '../dtos/CreateCommunityBody';
import { GetCommunitiesQuery } from '../dtos/GetCommunitiesQuery';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';

export const getCommunities = asyncHandler(async (req: Request<{}, {}, {}, GetCommunitiesQuery>, res: Response) => {
    let { limit, offset, searchWord } = req.query;

    let communities;
    if (searchWord) {
        communities = await communityModel.getCommunityByName(searchWord, limit, offset);
    } else {
        communities = await communityModel.getCommunitiesLimitedOffset(limit, offset);
    }

    res.status(200).json(communities);
});

export const getCommunityById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const community = await communityModel.getCommunityById(parseInt(id, 10));

    if (!community) {
        throw new NotFoundError('Community not found');
    }

    res.status(200).json(community);
});

export const createCommunity = asyncHandler(async (req: Request<{}, {}, CreateCommunityBody>, res: Response) => {
    const { name, description } = req.body;
    const imageFile = req.file;

    let imageURL = '';
    if (imageFile) {
        imageURL = await uploadToFirebase(imageFile);
    }

    const newCommunity = await communityModel.addCommunity(name, description, imageURL);
    res.status(201).json(newCommunity);
});


export const getCommunitiesWithMemberCount = asyncHandler(async (req: Request<{}, {}, {}, GetCommunitiesQuery>, res: Response) => {
    let { limit, offset, searchWord } = req.query;


    let communities;
    let user: User | null = req.user as User || null;
    let userId = user ? +user.id : null;

    if (!searchWord) {
        communities = userId
            ? await communityModel.getCommunitiesWithMemberCountForSignedIn(limit, offset, userId)
            : await communityModel.getCommunitiesWithMemberCount(limit, offset);
    } else {
        communities = userId
            ? await communityModel.getCommunitiesWithMemberCountAndByNameForSignedIn(searchWord, limit, offset, userId)
            : await communityModel.getCommunitiesWithMemberCountAndByName(searchWord, limit, offset);
    }

    res.status(200).json(communities);
});

export const countCommunities = asyncHandler(async (req: Request, res: Response) => {
    const count = await communityModel.countCommunities();
    res.status(200).json({ count });
});

export const countCommunityMembers = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const members = await communityModel.countCommunityMembers(parseInt(id, 10));
    res.status(200).json(members);
});

export const getCommunityMembers = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const members = await communityModel.getCommunityMembers(parseInt(id, 10));

    if (!members) {
        throw new NotFoundError('No members found for this community');
    }

    res.status(200).json(members);
});

export const getUserCommunitiesWithLimitAndOffset = asyncHandler(async (req: Request<{ id: string }, {}, {}, GetCommunitiesQuery>, res: Response) => {
    const { id } = req.params;
    let { limit, offset } = req.query;
    const userId = parseInt(id, 10);

    const response = await communityModel.getUserCommunities(userId, limit, offset);
    res.status(200).json({ communities: response });
});

export const addMemberToCommunity = asyncHandler(async (req: Request<{ communityId: string; userId: string }, {}, { role?: string }>, res: Response) => {
    const { communityId, userId } = req.params;
    const { role } = req.body;

    const newMember = await communityModel.addMemberToCommunity(parseInt(communityId, 10), parseInt(userId, 10), role);
    res.status(201).json(newMember);
});
