import { axiosClient, axiosProtected } from "../../../config/axios";


export const fetchUsers = async (limit,offset,searchWord) =>{
    console.log(limit,offset,searchWord);
    let request = `http://localhost:4000/users/?limit=${limit}&offset=${offset}`;
    if(searchWord){
        request += `&searchWord=${encodeURIComponent(searchWord)}`;
    }
    const response = await axiosProtected.get(request);
    return response;
}
export const connectToUser = async (userId) => {
    let request = `/users/createConnection`;
    const response = await axiosProtected.post(request,{
        userId
    });
    return response;
}