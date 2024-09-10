import { useEffect, useRef } from "react";
import classes from "./Modal.module.css";

function Modal({children,open,handleClose}) {
    const elemRef = useRef(null);
    useEffect(() => {
        if(open){
            elemRef.current.scrollIntoView(true);
        }else{
            elemRef.current.scrollIntoView(false);
        }
    }, [open]);
    return (    
    <>
    <div className={classes.backDrop + " " + (open ? classes.active:"")} onClick={handleClose}></div>
    <div ref={elemRef} className={classes.modalContainer + " " + (open ? classes.active:"")}>
    {children}
    </div>
    </>  );
}

export default Modal;