import {
  useNavigate,
  useSearchParams,
  useSubmit,
  useActionData,
  useNavigation,
} from "react-router-dom";
import classes from "./UsersPage.module.css";
import PaginationControls from "../components/pagination/PaginationControls";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersQuery } from "./controllers/Users.js";
import toast from "react-hot-toast";

function UsersPage() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const navigate = useNavigate();
  const action = useActionData();
  const navigation = useNavigation();

  // Check if the form is currently submitting
  const isSubmitting = navigation.state === "submitting";

  // Access the form data to identify which form is submitting
  const formData = navigation.formData;
  const connectedUser = formData?.get("userId");

  useEffect(() => {
    console.log(action,isSubmitting);
    if (action?.success && !isSubmitting) {
      console.log("toast");
      toast.success(action.message, {
        id: action.message,
      });
    }
  }, [action]);

  //handle pagination logic
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchWord = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const limit = 9; //  set a fixed limit
  const offset = (page - 1) * limit;
  const { data, error } = useQuery(usersQuery(limit, offset, searchWord));
  const { users, totalPages } = data?.data;
  console.log(data);
  const handleOnUserClick = (event, id) => {
    //? navigate to user profile page..
    navigate(`./${id}`);
    console.log("navigate");
  };

  const handleFollowClick = (event, id) => {
    event.stopPropagation();
    submit(
      {
        userId: id,
      },
      { method: "POST" }
    );
    console.log("Flollow");
  };

  return (
    <>
      <section className={classes.container}>
        <div className={classes.header}>
          <h1>Users</h1>
        </div>
        <ul className={classes["user__container"]}>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={(event) => handleOnUserClick(event, user.id)}
              className={classes["user"]}
            >
              <div className={classes["image"]}></div>
              <div className={classes["user__content"]}>
                <div className={classes["text"]}>
                  <span className={classes["name"]}>{user.username}</span>
                  <p className={classes["username"]}>{user.username}</p>
                </div>
                <button
                  className={classes["follow"]}
                  onClick={(event) => handleFollowClick(event, user.id)}
                  disabled={isSubmitting && +connectedUser === +user.id}
                >
                  {
                    isSubmitting && +connectedUser === +user.id ? "Connecting...":"Connect"
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

export default UsersPage;
