import './dropdown.css';
import deleteicon from '../../icon/delete.png';

const DropdownVideo = (props) => {

    const showModalDelete = () => {
        props.showModalDelete();
    }

    return(
        <div className="dropdown-wrapper-video">
            <ul className="dropdown-list-video">
                <li className="dropdown-item-video" onClick={showModalDelete}>
                    <div className="dropdown-link-video">
                        <img src={deleteicon} alt="icon" className="dropdown-video-icon"/>
                        <span>Delete</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default DropdownVideo;