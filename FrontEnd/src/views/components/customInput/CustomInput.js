import classes from "./CustomInput.module.css";
function CustomInput(props) {
    const {id}=props;
    return (  <div className={classes.form__group}>
        <input {...props} className={classes.form__field} id={id}  />
        <label htmlFor={id} className={classes.form__label}>{props.placeholder}</label>
    </div>
     );
}

export default CustomInput;