import { useRef, useState } from "react";
import Modal from "../../modal/Modal";
import Box from "../../box/Box";
import CustomInput from "../../customInput/CustomInput.js";
import { Form } from "react-router-dom";
import classes from "./EditProfile.module.css";
function EditProfileModal(props) {
    const {loading,user,picture,open,setOpen}= props;
    const inputRef = useRef(null);
    const [image, setimage] = useState(picture);

    const imageUploadHandler = (event) => {
        if (event.target.files[0]) {
          let imageSize = event.target.files[0].size / 1024 / 1024;
          if (imageSize < 5) {
            setimage(URL.createObjectURL(event.target.files[0]));
          }
        }
      };
    return (  
        <Modal open={open} handleClose={()=>setOpen(false)}>
        <Box>
        <h2 className={classes.title}>Edit Profile</h2>
        <Form className={classes.form} method="POST" encType="multipart/form-data" >
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
              src={image}
              alt="Community Image"
            />
            <p
            className={image === "/static/media/no-profile-picture-icon.b137df7bb70fab6f393e.jpg"?classes.show:""}
            >
              +
            </p>
            <CustomInput placeholder="Username" defaultValue={user?.username} id="username" required name="username" />
          </div>
          <CustomInput placeholder="Title" defaultValue={user?.title || ""} id="title" required name="title" />
          <CustomInput placeholder="Full Name" defaultValue={user?.name || ""} id="Full Name" required name="fullName" />
          <label htmlFor="description">Description</label>
          <textarea required name="description" id="description" placeholder="Maximum 250 characters"/>
          <button
            type="submit"
            name="formType"
            value="editProfile"
            disabled={loading}
          >
            { loading?
            "Loading...":
            "Create"
            }
          </button>
        </Form>
        </Box>
        </Modal>
    );
}




export default EditProfileModal;