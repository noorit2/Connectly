import { Link } from "react-router-dom";
import bkgline from "../../assests/images/wave.svg";
import classes from "./HomePage.module.css"
import { useRef } from "react";
import React from "react";
import { usePrevious } from "../../config/hooks/usePrevious";
function HomePage() {
  const eleRef = React.useRef();
  const [isInView, setIsInView] = React.useState(false);
  const wasInView = usePrevious(isInView);

  const checkInView = () => {
    const ele = eleRef.current;
    if (!ele) {
      return;
    }
    const rect = ele.getBoundingClientRect();
    setIsInView(rect.top < window.innerHeight && rect.bottom >= 0);
  };

  React.useEffect(() => {
    checkInView();
  }, []);

  React.useEffect(() => {
    document.addEventListener("scroll", checkInView);
    window.addEventListener("resize", checkInView);
    return () => {
      document.removeEventListener("scroll", checkInView);
      window.removeEventListener("resize", checkInView);
    };
  }, []);

  React.useEffect(() => {
    const ele = eleRef.current;
    if (!ele) {
      return;
    }
    if (!wasInView && isInView) {
      // Element has come into view
      console.log("in View");
    }
  }, [isInView]);
    return ( <>
    <section className={classes.first}>
        <h1>Talk to strangers,
        Make friends!</h1>
      <div className={classes.typewriter}>
      <h1>Connect. Chat. Create Memories</h1>
      </div>
      <Link to="/Auth?type=Register">Get Started</Link>
      <div className={classes.bkg}>
      <img src={bkgline} alt=""/>
      </div>
    </section>

    <section ref={eleRef} className={classes.second}>

    <Link to="/Communities">Reach People Like You</Link>
    <p>Find strangers worldwide, with similar interests.</p>
    <div>
    <div className={classes.content}>
      <div >
       <p >
        Hello
       </p>
    
      <ul >
       <li >Programmers !</li>
       <li >Gamers !</li>
       <li >Foodies !</li>
       <li>everybody !</li>
     </ul>
     </div>
    </div>
    </div>

    </section>
    </> );
}

export default HomePage;