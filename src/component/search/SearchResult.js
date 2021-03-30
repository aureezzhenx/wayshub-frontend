import './search.css';
import {Link} from 'react-router-dom';
import ButtonLoader from '../loader/ButtonLoader';

const SearchResult = (props) => {
    return (
        <div className="search-container">
            {props.videos.length > 0 ? (
                props.videos.map(video => {
                    return <div className="search-item" key={video.id}>
                                <div className="search-item-thumbnail">
                                    <img src={JSON.parse(video.thumbnail).path} alt='thumbnail' />
                                </div>
                                <div className="search-item-title">
                                    <Link to={`/detail/${video.id}`} className="link">
                                        <h3>{video.title}</h3>
                                    </Link>
                                </div>
                            </div>
                })
            ):(
                props.loading? (    
                    <div className="search-empty">
                        <ButtonLoader />
                    </div>
                ):(
                    <div className="search-empty">
                        <span>Video not found !</span>
                    </div>
                )
            )}
            {!props.isFinish && props.videos.length > 0 ? (
                <div className="search-show-more">
                    <button onClick={props.showMore}>
                        {props.loadShowMore ? (
                            <ButtonLoader />
                        ): "Show More"}
                    </button>
                </div>
            ): null}
        </div>
    )
}

export default SearchResult;