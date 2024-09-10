import classes from "./UserProfilePage.module.css";
import noProfilePicture from "../../../assests/images/no-profile-picture-icon.jpg";
import { useEffect, useState } from "react";
import UserContacts from "./components/UsersContacts";
import { userQuery } from "./controllers/UserProfile";
import { useFetcher, useNavigation, useParams, useSubmit } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthStore from "../../../store/auth";
import EditProfileModal from "./components/EditProfile";
function UserProfilePage() {
  const fetcher = useFetcher();
  const params = useParams();
  const currentUser = useAuthStore((store)=>store.user);

  const [rotate, setrotate] = useState(false);
  const [selectedTab, setselectedTab] = useState(null);
  const [showEdit, setshowEdit] = useState(false);

  const { data, error } = useQuery(userQuery(params.userId));
  const user = data?.data.user;
  const numOfJoinedCommunities = data?.data.joinedCommunitiesCount.total;
  const numOfConnectedUser = data?.data.connectedCount.total;
  const isSubmitting = fetcher.state === "submitting";
  console.log(data);

  useEffect(() => {
    if (fetcher.action?.success && !isSubmitting) {
      toast.success(fetcher.action.message, {
        id: fetcher.action.message,
      });
    }
  }, [fetcher.action]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('userId', user.id);

    fetcher.submit(formData, { method: 'post', action: '/Users' });
  };

  return (
    <>
    <EditProfileModal user={user} picture={user?.picture || noProfilePicture} loading={false} open={showEdit} setOpen={setshowEdit}/>
    <UserContacts id={user.id} selectedTab={selectedTab} setselectedTab={setselectedTab}/>
    <div
      className={classes.card + "  " + (rotate ? classes.rotate : undefined)}
    >
      <div className={classes["card-inner"]}>
        <div className={classes["card-front"]}>
          <img src={noProfilePicture} />
          <div><h1>{user?.username}</h1> 
              { currentUser.id === user.id?              
              <button onClick={()=>setshowEdit(true)} disabled={false}>Edit Profile</button>
              :
               <button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting?"Connecting...":"+ Connect"}</button>
              }
            </div>
          <div className={classes.userInfo}>
            <p onClick={()=>setselectedTab("Connections")}>{numOfConnectedUser} <span>Connections</span></p>
            <span></span>
            <p onClick={()=>setselectedTab("Communities")}>{numOfJoinedCommunities} <span>Communities</span></p>
          </div>
          <p>{user?.title}</p>
          <button onClick={() => setrotate((prev) => !prev)} className={classes["pushable"]}>
            <span className={classes["shadow"]}></span>
            <span className={classes["edge"]}></span>
            <span className={classes["front"]}>View More</span>
          </button>{" "}
        </div>
        <div className={classes["card-back"]}>
          <h1>About</h1>
          <p>{user?.description ? user.description : "No description avaiable.."}</p>
          <button onClick={() => setrotate((prev) => !prev)} className={classes["pushable"]}>
            <span className={classes["shadow"]}></span>
            <span className={classes["edge"]}></span>
            <span className={classes["front"]}>Go Back</span>
          </button>{" "}
        </div>
      </div>
    </div>
    </>
  );
}

export default UserProfilePage;
