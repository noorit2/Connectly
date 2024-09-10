import { Outlet, redirect, useNavigation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import classes from "./Root.module.css";
import { useEffect, useState } from "react";
import { axiosProtected } from "../../config/axios";
import useAuthStore from "../../store/auth";
import Loader from "../components/loader/Loader";
import {Toaster} from "react-hot-toast";
function Root() {
    const navigation = useNavigation();
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
        
        setShow(false); 
      } else { // if scroll up show the navbar
        setShow(true);  
      }
  
      // remember current page location to use in the next move
      setLastScrollY(window.scrollY); 
    };
  
    useEffect(() => {
      window.addEventListener('scroll', controlNavbar);
  
      // cleanup function
      return () => {
         window.removeEventListener('scroll', controlNavbar);
      };
    }, [lastScrollY]);

    useEffect(() => {
        async function checkAuth(){
            try{
            const response = await axiosProtected.post('/users/checkAuth');
            console.log(response.data);
            }catch(e){
              console.log(e,e.status);
                if(e.response?.status === 403){
                  useAuthStore.getState().logout();
                }
            }
        }
        checkAuth();
    }, []);

    return ( 
      <>
        <div className={classes.body}>
        <div>
         <Navbar show={show} scrollY={lastScrollY}/>
         </div>
         <main   className={classes.main}>
          { navigation.state === "loading" ?
          <div className={classes.loader}><Loader/></div>
            :      <Outlet/>
          }
        <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        />
        </main>   
        </div>
      </>
     );
}

export default Root;