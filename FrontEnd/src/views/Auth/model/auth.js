import {axiosClient, axiosProtected} from "../../../config/axios";


export async function signUp (username,email,password){
   return await axiosProtected.post("/users/",{username,email,password});
}
export async function signIn (email,password){
   return await axiosProtected.post("/users/signin",{email,password});
}

export async function signOut(){
   return await axiosProtected.get("/users/signout");
}