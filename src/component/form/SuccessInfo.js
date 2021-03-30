import './form.css';


const SuccessInfo = (props) => {
    return(
        <div className="success-info">
            <p>{props.message}</p>
        </div>
    );
}

export default SuccessInfo;