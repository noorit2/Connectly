import { axiosProtected } from "../../../../config/axios";



export const fetchUserByID = async (userId) =>{
    let request = `/users/${userId}`;
    const response = await axiosProtected.get(request);
    return response;
}
export const fetchConnections = async (userId,page) => {
    let request = `/users/${userId}/connections?limit=${10}&offset=${(page*10)}`
    console.log(request);
    const response = axiosProtected.get(request);
    return response;
}
export const fetchCommunities = async (userId,page) => {
    let request = `/communities/${userId}/communities?limit=${10}&offset=${(page*10)}`
    console.log(request);
    const response = axiosProtected.get(request);
    return response;
}

