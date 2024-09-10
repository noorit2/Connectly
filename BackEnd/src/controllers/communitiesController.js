import { communityModel } from "../models/communitiesModel.js";
import { bucket } from "../services/firebaseBucket.js";
export const getCommunities = async (req, res) => {
    try {
        let { limit, offset, searchWord } = req.query;
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);

        if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(offset) || offset < 0) {
            return res.status(400).json({message: "Invalid query parameters"});
        }
        let communities;
        if (searchWord) {
            // If a search term is provided, search communities by name
            communities = await communityModel.searchCommunitiesByName(searchWord,limit, offset);
        } else {
            // Otherwise, get communities with pagination
            communities = await communityModel.getCommunitiesLimitedOffset(parseInt(limit, 10), parseInt(offset, 10));
        }
        
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await communityModel.getCommunityById(parseInt(id, 10));
        if (community) {
            res.status(200).json(community);
        } else {
            res.status(404).json({ message: 'Community not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createCommunity = async (req, res) => {
    try {
        const {name,description} = req.body;
        console.log(name,description);
        const imageFile = req.file;
        console.log(imageFile);
        if(!name || !description){
            return res.status(400).json({message: "Invalid query parameters"});
        }
        let imageURL = '';
        if (imageFile) {
            const blob = bucket.file(`uploads/${Date.now()}-${imageFile.originalname}`);
            const blobStream = blob.createWriteStream({
              metadata: {
                contentType: imageFile.mimetype
              }
            });
      
            await new Promise((resolve, reject) => {
              blobStream.on('error', (e)=>{
                console.log(e);
                reject(e);
              });
              blobStream.on('finish', ()=>{
                resolve();
                console.log('Upload finished successfully.');
              });
              blobStream.end(imageFile.buffer);
              blob.getSignedUrl({
                action: "read",
                expires: '012-012-2024'
            }).then((URL)=>{
                imageURL=URL[0];
            }).catch(e=>{
                throw new Error(e?.message);
            });
            console.log(URL);
            });
               
          }
        const newCommunity = await communityModel.addCommunity(name,description,imageURL);
        res.status(201).json(newCommunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommunitiesWithMemberCount = async (req, res) => {
        try {
            console.log("request");
            console.log(req.isAuthenticated(),req.session);

            let { limit, offset, searchWord } = req.query;
            // Convert limit and offset to integers
            limit = parseInt(limit, 10);
            offset = parseInt(offset, 10);
    
            // Validate limit and offset
            if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(offset) || offset < 0) {
                return res.status(400).json({message: "Invalid query parameters"});
            }
    
            let communities;
            if (!searchWord) {
                if(req?.user){
                    communities = await communityModel.getCommunitiesWithMemberCountForSignedIn(limit,offset,req.user.id);
                }else{
                    communities = await communityModel.getCommunitiesWithMemberCount(limit, offset);
                }
                
            } else {
                if(req?.user){
                    communities = await communityModel.getCommunitiesWithMemberCountAndByNameForSignedIn(searchWord,limit,offset,req.user.id);
                }else{
                    communities = await communityModel.getCommunitiesWithMemberCountAndByName(searchWord, limit, offset);
                }
            }
            setTimeout(()=>{
                res.status(200).json(communities);
            },1000)
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
};

export const countCommunities = async (req, res) => {
    try {
        const count = await communityModel.countCommunities();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const countCommunityMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const members = await communityModel.countCommunityMembers(parseInt(id, 10));
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCommunityMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const members = await communityModel.getCommunityMembers(parseInt(id, 10));
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserCommunitiesWithLimitAndOffset = async (req,res)=>{
    try{
        const { id } = req.params;
        let { limit, offset } = req.query;
        let userId = parseInt(id);
        console.log(limit,offset,userId,"comm");
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);
        if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(offset) || !Number.isInteger(userId)) {
            return res.status(400).json({message: "Invalid query parameters"});
        }
        const response = await communityModel.getUserCommunities(userId,limit,offset);
        res.status(200).json({communities:response});

    }catch(e){
        res.status(500).json({ message: error.message });
    }
}
export const addMemberToCommunity = async (req, res) => {
    try {
        const { communityId, userId } = req.params;
        const { role } = req.body;
        const newMember = await communityModel.addMemberToCommunity(parseInt(communityId, 10), parseInt(userId, 10), role);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

