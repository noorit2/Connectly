import { useEffect, useState } from "react";
import Box from "../../box/Box";
import Modal from "../../modal/Modal";
import classes from "./UserContacts.module.css";
import { useFetcher, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCommunities, fetchConnections } from "../modules/UserProfile";
import noImage from "../../../../assests/images/no-profile-picture-icon.jpg";
import toast from "react-hot-toast";
function UserContacts(probs) {
  const { id, selectedTab,setselectedTab } = probs;
  const fetcher = useFetcher();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const {data,error,isFetching} = useQuery({
    queryKey: ["users",page,id],
    queryFn:() => fetchConnections(id,page),
    enabled: selectedTab !== null && selectedTab === "Connections",
    staleTime: 1000*60
  });

  const {data:communitiesData,error:errorCommunity,isFetching:isFetchingCommunities} = useQuery({
    queryKey: ["communities",page,id],
    queryFn:() => fetchCommunities(id,page),
    enabled: selectedTab !== null && selectedTab === "Communities",
    staleTime: 1000*60
  });

  const users = data?.data.users || [];
  const communities = communitiesData?.data.communities || [];
  const isSubmitting = fetcher.state === "submitting";

  console.log(communitiesData,errorCommunity);
  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (fetcher.action?.success && !isSubmitting) {
      toast.success(fetcher.action.message, {
        id: fetcher.action.message,
      });
    }
  }, [fetcher.action]);

  const handleSubmit = (id) => {
    const formData = new FormData();
    formData.append('userId', id);

    fetcher.submit(formData, { method: 'post', action: '/Users' });
  };

  const fetchData = async () => {
    try {
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
      console.log("scroll",page);
    setPage((prevPage) => prevPage + 1);
  };

  
  return (
    <>
    <Modal className={classes.container} open={selectedTab !== null} handleClose={()=>setselectedTab(null)}>
        <Box width={"md"} className={classes.MainContainer}>
      <h1>{selectedTab}</h1>
      <ul className={classes.taps}>
        <li onClick={() => setselectedTab("Connections")} className={selectedTab === "Connections"? classes.active:""}>Connections</li>
        <li onClick={() => setselectedTab("Communities")} className={selectedTab === "Communities"? classes.active:""}>Communities</li>
      </ul>
      { selectedTab === "Connections" &&
      <ul className={classes["user__container"]}>
      { users.length === 0 ?<div className={classes.loader}> <p>No {selectedTab} available!</p></div>:""}
      { users.map((u) => 
        <li>
          <div className={classes["user"]} onClick={()=>navigate(`/Users/${u.id}`)}>
            <div className={classes["image"]}><img src={u?.image || noImage} alt="profile picture"></img></div>
            <div className={classes["user__content"]}>
              <div className={classes["text"]}>
                <span className={classes["name"]}>{u.username}</span>
                <p className={classes["username"]}>@{u.username}</p>
              </div>
              <button className={classes["follow"]} onClick={()=>handleSubmit(u.id)}>Connect</button>
            </div>
          </div>
        </li>
      )}
      </ul>
      }
      {
        selectedTab === "Communities" && 
        <ul className={classes["user__container"]}>
      { communities.length === 0 ?<div className={classes.loader}> <p>No {selectedTab} available!</p></div>:""}
      { communities.map((c) => 
        <li>
          <div className={classes["user"]} onClick={()=>{/*Navigate to Community */}}>
            <div className={classes["image"] + " " + classes["community"]}><img src={c?.chat_image ?? noImage} alt="profile picture"></img></div>
            <div className={classes["user__content"]}>
              <div className={classes["text"]}>
                <span className={classes["name"]}>{c?.chat_name}</span>
                <p className={classes["username"]}>{c.member_count} Member(s)</p>
              </div>
              <button className={classes["follow"]} onClick={()=>{/*Navigate to Community */}}>View</button>
            </div>
          </div>
        </li>
      )}
      </ul>
      }
      {isFetching || isFetchingCommunities && <div className={classes.loader}><p>Loading...</p></div>}
      </Box>
    </Modal>
    </>
  );
}

export default UserContacts;
