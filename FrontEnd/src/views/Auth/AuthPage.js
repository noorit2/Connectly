import { Form, Link, useActionData, useLocation, useNavigation } from "react-router-dom";
import classes from "./LoginPage.module.css";
import decPhoto from "../../assests/images/loginPhoto.png"
import { useEffect, useState } from "react";
function AuthPage() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type") || actionData?.type;
    const [fromRegister, setfromRegister] = useState(type==="Register");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        // Check if the navigation is currently loading and set loading state
        if (navigation.state === "submitting" || navigation.state === "loading") {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      }, [navigation.state]);

      useEffect(() => {
        if(type==="Register"){
            setfromRegister(true);
        }
        
      }, [type]);
    return ( <>
    <div className={classes.maincontainer}>
        <div className={classes.secContainer + " " + classes[type] + " " + ((fromRegister && type==="Login")?classes["fromRegister"]:null)}>
        <img src={decPhoto} alt=""/>
        <div>    
        <div className={classes.pinkSQ }></div>
        </div>
        <div className={classes.formSide}>
            {type === "Login" ? <>
            <h1>Login</h1>
            {actionData?.error && <p style={{ color: 'red' }} className={classes.error} >{actionData.error}</p>}
            <Form method="POST" action="/Auth">
                <label htmlFor="email" >Email</label>
                <input type="email" required name="email" id="email"/>
                <label htmlFor="password">Password</label>
                <input type="password" required name="password" id="password"/>
                <button type="submit" name="formType" value="signIn" disabled={isLoading}>{isLoading?"...loading":"Login"}</button>
            </Form>
            <div className={classes.withSection}>
                <span></span>
                <p>or continue with</p>
                <span></span>
            </div>
            <p>Don't have an account? <Link to="/Auth?type=Register">Sign Up</Link></p>
            </>
            : <>
             <h1>Register</h1>
             {actionData?.error && <p style={{ color: 'red' }} className={classes.error}>{actionData.error}</p>}
            <Form method="POST" action="/Auth">
                <label htmlFor="username" >Username</label>
                <input type="text" required name="username" id="username"/>
                <label htmlFor="email" >Email</label>
                <input type="email" required name="email" id="email"/>
                <label htmlFor="password">Password</label>
                <input type="password" required name="password" id="password"/>
                <button type="submit" name="formType" value="register" disabled={isLoading}>{isLoading?"...loading":"Login"}</button>
            </Form>
            <div className={classes.withSection}>
                <span></span>
                <p>or continue with</p>
                <span></span>
            </div>
            <p>Already have an account? <Link to="/Auth?type=Login">Register</Link></p>
            </>
}
        </div>
        </div>
    </div>
    </> );
}

export default AuthPage;