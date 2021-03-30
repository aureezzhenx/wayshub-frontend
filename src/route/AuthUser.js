import { AppContext } from '../context/AppContext';
import { useContext} from 'react';
import { API , setAuthToken } from '../config/api';



const AuthUser = async () => {
    const [state, dispatch] = useContext(AppContext);
    try {
        if(localStorage.token){
            setAuthToken(localStorage.token);
        }

        const response = await API.get('/auth');
            
        if(response.data.status === "success"){
            dispatch({
                type: "AUTH_USER",
                payload: response.data.data.user
            });
        }
  
    } catch(err){
        console.log(err)
    }

    
}

export default AuthUser;