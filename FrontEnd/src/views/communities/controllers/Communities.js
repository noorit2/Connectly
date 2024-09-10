import { createCommunity, fetchCommunities, joinCommunity } from "../models/Communities"


// ⬇️ define your query
export const communitiesQuery = (limit,offset,searchWord,userId) => ({
  queryKey: ['communities',offset,limit,searchWord],
  queryFn: async () => fetchCommunities(limit,offset,searchWord,userId),
  staleTime:1000 * 60
})

// ⬇️ needs access to queryClient
export const communitiesLoader =
  async (request,params,queryClient) =>{
    const url = new URL(request.url);
    const searchWord = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = 9; // Assuming you have a fixed limit
    const offset = (page - 1) * limit;
    const query = communitiesQuery(limit,offset,searchWord)
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }


  export async function communityAction(request,queryClient) {
    const data = await request.formData();
    const formType = data.get('formType'); 
    console.log(data);
    if (formType === 'joinCommunity') {
      const info = {
        userId: data.get('userId'),
        communityId: data.get('communityId'),
    };
    console.log(info);
    if(!info?.userId || !info?.communityId){
      return { error: "Invalid Field Value"};
    }else{
      try{
        const response = await joinCommunity(info.communityId,info.userId);
        if(response.status !== 201){
          throw new Error(response.data.error || 'Unknown error occurred');
        }else{
          await queryClient.invalidateQueries({ queryKey: ["communities"] });
          return { success: true, message: "Successfully joined the community!" };
        }
      }catch(e){
        if(e.status === 500){
          throw new Error(e);
      } else{
        return { error: e.message, status: e.status || "" };
      }
      }
    }
    }

    if (formType === 'createCommunity') {
      console.log(data);
      const info = {
        name: data.get('name'),
        description: data.get('description'),
        file: data.get('image')
    };
    console.log(info);
    if(!info?.name || !info?.description){
      return { error: "Invalid Field Value"};
    }else{
      const uploadData = new FormData();
      uploadData.append('name', info.name);
      uploadData.append('description', info.description);
      uploadData.append('image', info.file);
      try{
        const response = await createCommunity(uploadData);
         if(response.status !== 201){
          throw new Error(response.data.error || 'Unknown error occurred');
         }else{
         await queryClient.invalidateQueries({ queryKey: ["communities"] });
         return { success: true, message: "Community created successfully!" };
          //? handle rest later...
        }
      }catch(e){
        console.log(e);
        if(e.status === 500){
          throw new Error(e);
      } else{
        return { error: e.message, status: e.status || "" };
      }
      }
    }
  }
  
    return { error: "Invalid form submission" };
}