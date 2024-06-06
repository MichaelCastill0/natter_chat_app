import { useContext } from 'react'
import { useLocation } from 'react-router-dom';
import {Route, Redirect, Outlet, Navigate, useInRouterContext } from 'react-router-dom'
import { UserContext } from '../App';

const useAuth = () => {
    const { user } = useContext(UserContext);
    return user && user.loggedIn;
}
const PrivateRoutes = ({ isAuth: isAuth, component: Component, ...rest }) => {
    //let auth = {'token':true}
   //const isAuth = useAuth();

    return (
        <Route {...rest} 
            render={(props)=> {
                if (isAuth){
                    return <Component />
                } else {
                    return <Navigate to={{pathname: '/login', state: {from: props.location}}} />
                }
            }}
        />
    );
    //isAuth ? <Outlet /> : <Navigate to = '/'/>;
/*    
    return(
        auth.token ? <Outlet/>: <Navigate to= '/login'/>
    )
*/
}

export default PrivateRoutes