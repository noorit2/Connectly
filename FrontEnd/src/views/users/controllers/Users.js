import { connectToUser, fetchUsers } from "../models/Users";

export const usersQuery = (limit,offset,searchWord) => ({
    queryKey: ['users',offset,limit,searchWord],
    queryFn: async () => fetchUsers(limit,offset,searchWord),
    staleTime:1000 * 60
  })
  
  // ⬇️ needs access to queryClient
  export const usersLoader =
    async (request,params,queryClient) =>{
      const url = new URL(request.url);
      const searchWord = url.searchParams.get('search') || '';
      const page = parseInt(url.searchParams.get('page'), 10) || 1;
      const limit = 9; // Assuming you have a fixed limit
      const offset = (page - 1) * limit;
      const query = usersQuery(limit,offset,searchWord)
      // ⬇️ return data or fetch it
      return (
        queryClient.getQueryData(query.queryKey) ??
        (await queryClient.fetchQuery(query))
      )
    }

    export async function usersAction(request,queryClient) {
      const data = await request.formData();
      const info = {
        userId: data.get('userId'),
    };
    if(!info?.userId){
      return { error: "Invalid Field Value"};
    }else{
      try{
        const response = await connectToUser(info.userId);
        if(response.status !== 201){
          throw new Error(response.data.error || 'Unknown error occurred');
        }else{
          await queryClient.invalidateQueries({ queryKey: ["users"] });
          return { success: true, message: "Successfully Connected to User!" };
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
