import {Link} from 'react-router-dom';
import {useState, useRef, createRef, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../App.css';
import title from '../title.svg';
import InputField from '../component/form/InputField';
import Alert from '../component/form/Alert';
import { API, setAuthToken } from '../config/api';

const Login = () => {
    const router = useHistory()
    const [state, dispatch] = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef([createRef(), createRef()]);
    const [error, setError] = useState({
        status: false,
        message: ''
    });
  
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const validate = () => {
        const error = [];
        for(let i = 0; i < inputRef.current.length; i++){
            const valid = inputRef.current[i].current.validate();

            if(!valid){
                error.push("error");
            }
        }

        if(error.length > 0){
            return false;
        }

        inputRef.current[0].current.doSubmit();
        inputRef.current[1].current.doSubmit();

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            if(!validate()){
                setLoading(false);
                return false;
            }

            const body = JSON.stringify(formData);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await API.post('/login', body, config);

            if(response.data.status === "error"){
                
                setError({
                    status: true,
                    message: "Invalid login"
                });
                setLoading(false);
                return false;
            }

            dispatch({
                type: 'LOGIN',
                payload: response.data.data.chanel
            });

            setAuthToken(response.data.data.chanel.token);
            router.push('/');
           
        } catch(err){
            console.log(err);
        }
    }

    const handleInputChange = (name, value) => {
        setError({
            status: false
        });

        setFormData({
            ...formData,
            [name] : value
        });
    }

    return(
        <div className="landing-container">
            <div className="landing-welcome">
                <img src={title} alt ="title" />
                <Link to="/register" className="link">
                    <button className="button">Sign Up</button>
                </Link>
            </div>

            <div className="landing-form">
                <h1>Sign In</h1>
                {error.status ? <Alert status="error-info" message={error.message} />:null}
                <form onSubmit={handleSubmit}>
                    <InputField 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        onChange={(name, value) => handleInputChange(name, value)}
                        autoComplete="off"
                        value={formData.email}
                        ref={inputRef.current[0]}
                        validation={['required', 'email']}
            
                    />
                    <InputField 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        onChange={(name, value) => handleInputChange(name, value)}
                        autoComplete="off"
                        value={formData.password}
                        ref={inputRef.current[1]}
                        validation={['required']}
                        
                    />
                    <button className="button">Sign In</button>
                </form>
            </div>
        </div> 
    )
}

export default Login;