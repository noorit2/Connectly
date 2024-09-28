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
      <svg
        id="visual"
        viewBox="0 0 900 200"
        version="1.1"
      >
        <path
          d="M0 141L18.8 136.8C37.7 132.7 75.3 124.3 112.8 116.3C150.3 108.3 187.7 100.7 225.2 109.3C262.7 118 300.3 143 337.8 141.2C375.3 139.3 412.7 110.7 450.2 89.8C487.7 69 525.3 56 562.8 60C600.3 64 637.7 85 675.2 96.5C712.7 108 750.3 110 787.8 116.7C825.3 123.3 862.7 134.7 881.3 140.3L900 146"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="miter"
          stroke="#4338CA"
          strokeWidth="2"
        />
      </svg>
      </div>
    </section>

    <section ref={eleRef} className={classes.second}>

    <Link to="/Communities">Reach People Like You</Link>
    <h2>Find strangers worldwide, with similar interests.</h2>
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