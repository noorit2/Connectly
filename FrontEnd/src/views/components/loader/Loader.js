import classes from "./Loader.module.css";
function Loader() {
    return ( <div className={classes.typewriter}>
    <div class={classes.slide}><i></i></div>
    <div class={classes.paper}></div>
    <div class={classes.keyboard}></div>
</div> );
}

export default Loader;


