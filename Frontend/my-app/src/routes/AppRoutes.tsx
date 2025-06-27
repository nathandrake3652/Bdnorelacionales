import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import {Home} from '../pages/Home';
import {PrivateRoute} from './PrivateRoute';
import Notificaciones from '../pages/Notificaciones';



export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/Login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>
      <Route path='/Home'element = {<PrivateRoute> <Home/> </PrivateRoute>}/>
      <Route path='/Notificaciones'element = {<PrivateRoute> <Notificaciones/> </PrivateRoute>}/>
    </Routes>
  );
};