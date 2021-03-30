import './dropdown.css';
import deleteicon from '../../icon/delete.png';

const DropdownComment = (props) => {

    const showModalDelete = () => {
        props.showModalDelete();
    }

    return(
        <div className="dropdown-wrapper-comment">
            <ul className="dropdown-list-comment">
                <li className="dropdown-item-comment" onClick={showModalDelete}>
                    <div className="dropdown-link-comment">
                        <img src={deleteicon} alt="icon" className="dropdown-comment-icon"/>
                        <span>Delete</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default DropdownComment;