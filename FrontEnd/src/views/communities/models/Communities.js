import { axiosClient, axiosProtected } from "../../../config/axios";


export const fetchCommunities = async (limit,offset,searchWord,userId="") =>{
    console.log(limit,offset,searchWord);
    let request = `http://localhost:4000/communities/with-member-count?limit=${limit}&offset=${offset}`;
    if(searchWord){
        request += `&searchWord=${encodeURIComponent(searchWord)}`;
    }
    // if(userId){
    //     request += `&userId=${encodeURIComponent(userId)}`;
    // }
    const response = await axiosProtected.get(request);
    return response;
}

export const createCommunity = async (formData) => {
    const response = await axiosProtected.post('/communities/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
}

export const joinCommunity = async (communityId,userId) =>{
    let request = `http://localhost:4000/communities/${communityId}/members/${userId}`;
    const response = await axiosProtected.post(request);
    return response;
}
