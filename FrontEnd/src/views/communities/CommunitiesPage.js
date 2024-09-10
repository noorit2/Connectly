import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import classes from "./CommunitiesPage.module.css";
import PaginationControls from "../components/pagination/PaginationControls";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { communitiesQuery } from "./controllers/Communities";
import noImageAvailable from "../../assests/images/noImage.jpg";
import useAuthStore from "../../store/auth";
import CustomInput from "../components/customInput/CustomInput";
import noImage from "../../assests/images/noImage.png";
import toast from "react-hot-toast";
function CommunitiesPage() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const action = useActionData();
  const navigation = useNavigation();

  // Check if the form is currently submitting
  const isSubmitting = navigation.state === "submitting";

  // Access the form data to identify which form is submitting
  const formData = navigation.formData;
  const formType = formData?.get("formType");
  const joinedCommunity = formData?.get("communityId");
  const isJoiningCommunity = isSubmitting && formType === "joinCommunity";
  const isCreatingCommunity = isSubmitting && formType === "createCommunity";

  const isAuth = useAuthStore((store) => store.isAuthenticated);
  const user = useAuthStore((store) => store.user);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false); // Manage popover visibility
  const formRef = useRef(null); // Create a ref for the form

  useEffect(() => {
    if(action?.success && !isSubmitting){
      toast.success(action.message,{
        id:action.message
      });
      if(isPopoverVisible){
        setIsPopoverVisible(false);
      }
      formRef.current?.reset(); // Reset the form after successful submission
      setimage(null); // Reset the image preview if needed
  }
  }, [action]);

  //handle pagination logic
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchWord = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const limit = 9; //  set a fixed limit
  const offset = (page - 1) * limit;
  const { data, error } = useQuery(communitiesQuery(limit, offset, searchWord));
  const { communities, totalCount, totalPages } = data.data;
  console.log(totalPages);
  const inputRef = useRef(null);
  const [image, setimage] = useState(null);
  const imageUploadHandler = (event) => {
    if (event.target.files[0]) {
      let imageSize = event.target.files[0].size / 1024 / 1024;
      if (imageSize < 5) {
        setimage(URL.createObjectURL(event.target.files[0]));
      }
    }
  };

  const handleJoinClick = (chat_id) => {
    if (isAuth) {
      submit(
        {
          formType: "joinCommunity",
          userId: user.id,
          communityId: chat_id,
        },
        { method: "POST" }
      );
    } else {
      console.log("error");
      toast.error("Must be logged in first!",{
      id:chat_id,
      });
    }
  };
  return (
    <>
    {isPopoverVisible &&
      <div popover="auto" id="my-popover" className={classes.popover}>
        <h2>Create your community</h2>
        <Form method="POST" encType="multipart/form-data" ref={formRef}>
          <div>
            <input
              ref={inputRef}
              onChange={imageUploadHandler}
              hidden
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              name="image"
              id="image"
            />
            <img
              onClick={() => inputRef.current.click()}
              src={image || noImage}
              alt="Community Image"
            />
            <p>+</p>
            <CustomInput placeholder="name" id="name" required name="name" />
          </div>
          <label htmlFor="description">Community Description</label>
          <textarea required name="description" id="description" />
          <button
            type="submit"
            name="formType"
            value="createCommunity"
            disabled={isCreatingCommunity}
          >
            { isCreatingCommunity?
            "Loading...":
            "Create"
            }
          </button>
        </Form>
      </div>
}
      <section className={classes.container}>
        <div className={classes.header}>
          <h1>Communities</h1>
          <button popovertarget="my-popover" onClick={()=>setIsPopoverVisible(true)}>+ Create a Community</button>
        </div>
        <ul className={classes.list}>
          {communities.map((com) => (
            <li key={com.chat_id}>
              <img src={com.chat_image || noImageAvailable} alt={com.name} />
              <div>
                <h2>{com.chat_name}</h2>
                <p>{com.member_count} members</p>
              </div>
              <p>{com.chat_description}</p>
              <div>
                <button onClick={() => handleJoinClick(com.chat_id)} disabled={isJoiningCommunity && +joinedCommunity === +com.chat_id}>
                {  isJoiningCommunity && +joinedCommunity === +com.chat_id?
                  "Joining...":
                  "Join Community"
                 }
                </button>
              </div>
            </li>
          ))}
        </ul>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      </section>
    </>
  );
}

export default CommunitiesPage;
