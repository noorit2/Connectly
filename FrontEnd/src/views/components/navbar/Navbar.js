import { Link, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import useAuthStore from "../../../store/auth";
import { axiosProtected } from "../../../config/axios";
import noImage from "../../../assests/images/no-profile-picture-icon.jpg";
import Modal from "../modal/Modal";
import {  useRef, useState } from "react";
import Box from "../box/Box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import useAppMode from "../../../store/appMode";

function Navbar(props) {
    const {show,scrollY}=props;
    const isAuth = useAuthStore((store)=>store.isAuthenticated);
    const currentUser = useAuthStore((store)=>store.user);
    const navigate = useNavigate();
    const ref = useRef(null);

    const logoutHandler = ()=>{
        async function logout(){
        try{
       const response = await axiosProtected.get("/users/signout");
       if(response.status !== 201){
        console.log(response.data,response.status);
        
        throw new Error(response.data.error || 'Unknown error occurred');
       }else{
        console.log("success");
        
        useAuthStore.getState().logout();
       }
        }catch(e){

        }
        }
        logout();
    }
    
    const selectionHandler = (value) => {
        useAppMode.getState().changeMode(value);
    }

   if(!show){
    if(ref.current)
    ref.current.hidePopover();
   }

    return ( 
        <header className={classes.header + " " + (show   ? "": classes.hide) + " " + (scrollY>20 ? classes.bg : "") }>
            <nav> 
                <ul>
                    <li className={classes.logo}>
                        <Link to="/" >
                           <h1> LOGO</h1>
                        </Link>
                    </li>
                    <li className={classes.mainNav}>
                        <Link to="/">Home</Link>
                        <Link to="/">Chats</Link>
                        <Link to="/Communities">Communities</Link>
                        <Link to="/Users">Connect</Link>
                    </li>
                    <li>
                    <>
                    { !isAuth ?
                    <ul>
                    <li className={classes.login}>
                        <Link to="/Auth?type=Login" >Login</Link>
                    </li>
                    <li>
                        <Link to="/Auth?type=Register">Register</Link>
                    </li>
                    </ul>
                    :
                    <>
                    <li className={classes.popoverList}><button popovertarget="list"><img src={noImage} alt="profile picture"/></button></li>
                    <div  className={classes.profile} ref={ref} popover="auto" id="list">
                    <Box as="div" width="mini">
                    <Link to={`/Users/${currentUser?.id}`}><img src={noImage} alt="profile picture"/> <p>@username</p> </Link>
                    <select onChange={(e)=>selectionHandler(e.currentTarget.value)}>
                        <option value="default" aria-label="default">Default (system preference) </option>
                        <option value="light" aria-label="light">Light</option>
                        <option value="dark" aria-label="dark">Dark</option>

                    </select>
                    <Link to="/" onClick={logoutHandler}><FontAwesomeIcon  width="1.5rem" icon={faSignOut}/><p>Logout</p></Link>
                    </Box>
                    </div>
                   </>
                    }
                    </>
                    </li>
                </ul>
            </nav>
        </header>
     );
}

export default Navbar;