import './form.css';

const Alert = (props) => {

    return(
        <div className={props.status}>
            <p>{props.message}</p>
        </div>
    );
}

export default Alert;