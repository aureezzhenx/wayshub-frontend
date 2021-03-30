import './channel.css';

const ChannelDescription = (props) => {
    console.log(props);
    return(
        <div className="channel-description">
            <p>{props.data.description}</p>
        </div>
    )
}

export default ChannelDescription;