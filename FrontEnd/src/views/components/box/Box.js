import classes from "./Box.module.css"

function Box({as: Component = 'div',className,children,width,...props}) {
    return ( <Component  className={classes.box + " " + (width?classes[width]:classes.sm) + " " + (className?className:"") }>
        {children}
    </Component> );
}

export default Box;