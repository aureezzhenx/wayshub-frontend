import './form.css';

const ErrorInfo = (props) => {
    return(
        <div className="input-validation">
            <div className="validation-triangle"></div>
            <span>{props.messages}</span>
        </div>
    );
}

export default ErrorInfo;