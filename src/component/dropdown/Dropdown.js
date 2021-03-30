import {Link} from 'react-router-dom';
import {useContext} from 'react';
import {AppContext} from '../../context/AppContext';

import './dropdown.css';
import user_icon from '../../icon/user_icon.svg';
import user_icon_active from '../../icon/user_icon_active.svg';
import logout_icon from '../../icon/logout_icon.svg';

const Dropdown = () => {
    const [state, dispatch] = useContext(AppContext);

    const pathName = window.location.pathname;

    const handleClick = () => {
        dispatch({
            type:"LOGOUT"
        })
    }

    return(
        <div className="dropdown-wrapper">
            <div className="polygon"></div>
            <ul className="dropdown-list">
                <li className="dropdown-item">
                    <Link to="/my-channel" className="dropdown-link link">
                        <img src={pathName === '/my-channel'? user_icon_active:user_icon} alt="user icon" />
                        <span className={pathName === '/my-channel'? 'active':''}>My Channel</span>
                    </Link>
                </li>
                <li className="dropdown-item">
                    <div className="dropdown-link" onClick={handleClick}>
                        <img src={logout_icon} alt="logout icon" />
                        <span>Logout</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown;