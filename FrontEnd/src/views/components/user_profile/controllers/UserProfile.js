import { fetchUserByID } from "../modules/UserProfile";

export const userQuery = (userId) => ({
    queryKey: ['users',userId],
    queryFn: async () => fetchUserByID(userId),
    staleTime:1000 * 60
  })


export const userProfileLoader =
async (request,params,queryClient) =>{
  const userId = params.userId;
  const query = userQuery(userId)
  // ⬇️ return data or fetch it
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
