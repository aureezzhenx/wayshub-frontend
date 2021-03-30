import {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import './navbar.css';
import add_video_icon from '../../icon/add_video_icon.svg';
import add_video_icon_active from '../../icon/add_video_icon_active.svg';
import Dropdown from '../dropdown/Dropdown';
import SearchResult from '../search/SearchResult';
import {API} from '../../config/api';

const Navbar = () => {
    const [loading, setLoading] = useState(true);
    const [loadResult, setLoadResult] = useState(false);
    const [loadShowMore, setLoadShowMore] = useState(false);
    const [result, setResult] = useState(false);
    const [videos, setVideos] = useState([]);
    const [limit, setLimit] = useState(4);
    const [finish, setFinish] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const pathName = window.location.pathname;
    const [isDropdown, setDropdown] = useState(false);
    const history = useHistory();

    const [formData, setFormData] = useState({
        keyword: ''
    });

    const handleDropdown = () => {
        isDropdown? setDropdown(false):setDropdown(true);
    }

    const getUser = () => {
        if(!currentUser){
            setLoading(true);
        } else {
            setLoading(false);
            
        }
    }

    const handleInputChange = async (event) => {
        try {
            setResult(true);
            setLoadResult(true);
            setFinish(false);
            if(event.target.value === ""){
                setVideos([]);
                setResult(false);
                setFormData({
                    keyword: ''
                })
                setLoadResult(false);
                return;
            }
            const body = {
                keyword: event.target.value,
                offset: 0,
                limit
            }

            const response = await API.post('/search', body);
            console.log(response.data.data.videos)

            if(response.data.status !== "success"){
                setVideos([]);
                setResult(false);
                setFormData({
                    keyword: ''
                })
                setLoadResult(false)
                return;
            }

            setFormData({
                keyword: event.target.value
            });

            setVideos(
                response.data.data.videos
            )

            setLoadResult(false);

            if(response.data.data.videos.length === 0){
                setVideos([]);
            }

          
        } catch(err){
            console.log(err);
        }
    }

    const showMore = async () => {
        try {
            setLoadShowMore(true);

            const tmpData = [...videos];
            const lastIndex = tmpData.length;

            const body = {
                keyword: formData.keyword,
                offset : tmpData.length,
                limit
            }

            const response = await API.post('/search', body);

            for(let i = 0; i < response.data.data.videos.length; i++){
                tmpData[lastIndex + i] = response.data.data.videos[i]
            }

            if(response.data.data.videos.length === 0){
                setFinish(true);
            }

            setVideos(tmpData);
            setLoadShowMore(false)

        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getUser();
    },[currentUser])

    useEffect(() => {
        return history.listen(() => {
            setDropdown(false);
        })
    }, [history]);

    return(
        <div className="navbar">
            <div className="search-bar">
                <input type="text" placeholder="Search..." onChange={handleInputChange} name="keyword" autoComplete="off"/>
                {result && (
                    <SearchResult 
                        videos={videos} 
                        showMore={showMore} 
                        isFinish={finish} 
                        loading={loadResult}
                        loadShowMore={loadShowMore}
                    />
                )}
            </div>
            <div className="navbar-menu">
                <ul className="navbar-menu-list">
                    <li className="navbar-menu-item">
                        <Link to='/add' className="navbar-menu-link link">
                            <img src={pathName === '/add'? add_video_icon_active:add_video_icon} alt="add_video_icon"/>
                            <span className={pathName === '/add'? 'active':''}>Add Video</span>
                        </Link>
                    </li>

                    <li className="navbar-menu-item">
                        <button className="navbar-menu-button" onClick={handleDropdown}>
                            {loading && !currentUser ? "":<img src={JSON.parse(currentUser.photo).path} alt="add_video_icon"/>}
                        </button>
                        {isDropdown ? <Dropdown/>: ""}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;