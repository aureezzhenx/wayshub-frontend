import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';

const PrivateRoute = ({ component: Component, ...rest}) => {
    const [state] = useContext(AppContext);
    const {loading, login} = state;


    return(
        <Route 
            {...rest}
            render={(props) =>
                loading? 
                    (<h1>Loading ...</h1>) : 
                login? 
                    (<Component {...props} />) : 
                    (<Redirect to="/login" />)
            }
        />
    );
};

export default PrivateRoute;
