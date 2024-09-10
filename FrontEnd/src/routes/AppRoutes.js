
import AuthPage from "../views/Auth/AuthPage"
import { handleUserAuthAction } from "../views/Auth/controller/auth"
import HomePage from "../views/Home/HomePage"
import Root from "../views/Root/Root"
import CommunitiesPage from "../views/communities/CommunitiesPage.js"
import { communitiesLoader, communityAction } from "../views/communities/controllers/Communities.js"
import UserProfilePage from "../views/components/user_profile/UserProfilePage.js"
import { userProfileLoader } from "../views/components/user_profile/controllers/UserProfile.js"
import UsersPage from "../views/users/UsersPage.js"
import { usersAction, usersLoader } from "../views/users/controllers/Users.js"

export const AppRoutes =(queryClient) => [
    {
        path: "/",
        element: <Root/>,
        children:[
            {
                path: "/",
                element: <HomePage/>,
            },
            {
                path: "/Auth",
                element: <AuthPage/>,
                action:handleUserAuthAction
            },
            {
                path: "/Communities",
                element: <CommunitiesPage/>,
                loader: ({request,params}) => communitiesLoader(request,params,queryClient),
                action: ({request}) => communityAction(request,queryClient)
            },
            {
                path:"/Users",
                loader: ({request,params}) => usersLoader(request,params,queryClient),
                action: ({request}) => usersAction(request,queryClient),
                children:[
                    {
                        path: "",
                        element: <UsersPage/>
                    },
                    {
                        path: ":userId",
                        element: <UserProfilePage/>,
                        loader: ({request,params}) => userProfileLoader(request,params,queryClient)
                    },
                ]
            }
        ]
      },
]