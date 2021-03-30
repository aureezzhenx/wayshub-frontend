import './comment.css';
import CommentList from './CommentList';
import {useState} from 'react';

import ButtonLoader from '../loader/ButtonLoader';

const Comment = (props) => {
    const [formData, setFormData] = useState({
        comment: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            [event.target.name]: event.target.value
        })
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await props.addComment(formData);
        setFormData({
            comment:""
        });
        setLoading(false);
    }

    return(
        <div className="comment-container">
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="comment-input">
                    <img src={JSON.parse(props.currentUser.photo).path} alt="profile" />
                    <textarea
                        type="text" 
                        placeholder="Add Comment..." 
                        name="comment" 
                        onChange={handleChange} 
                        value={formData.comment}
                    >
                    </textarea>
                </div>
                <button className="button">
                    {loading ? (
                        <ButtonLoader />
                    ): ("Comment")}
                </button>
            </form>

            {
                props.comments.map(comment => {
                    return <CommentList 
                                currentUser={props.currentUser}
                                data={comment} 
                                key={comment.id}
                                deleteComment={async (commentId) => {props.deleteComment(commentId)}} 
                            />
                })
            }
            
            
        </div>
    )
}

export default Comment;