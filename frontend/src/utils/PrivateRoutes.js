import { useContext } from 'react'
import { useLocation } from 'react-router-dom';
import {Outlet, Navigate, useInRouterContext } from 'react-router-dom'
import { UserContext } from '../App';

const useAuth = () => {
    const { user } = useContext(UserContext);
    return user && user.loggedIn;
}
const PrivateRoutes = (isAuth) => {
    //let auth = {'token':true}
   // const isAuth = useAuth;

    return isAuth ? <Outlet /> : <Navigate to = '/'/>;
/*    
    return(
        auth.token ? <Outlet/>: <Navigate to= '/login'/>
    )
*/
}

export default PrivateRoutes