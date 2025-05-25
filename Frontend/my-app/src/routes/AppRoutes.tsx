import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import {Home} from '../pages/Home';
import {PrivateRoute} from './PrivateRoute';
import {Reserva} from '../pages/ReservasUsuario';
import { Reservar } from '../pages/Reservar';
import { HistorialReservas } from '../pages/reservasHistorial';


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/Login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>
      <Route path='/Home'element = {<PrivateRoute> <Home/> </PrivateRoute>}/>
      <Route path='/ReservasUsuario'element = {<PrivateRoute> <Reserva/> </PrivateRoute>}/>
      <Route path='/Reservar'element = {<PrivateRoute> <Reservar/> </PrivateRoute>}/>
      <Route path='/reservasHistorial'element = {<PrivateRoute><HistorialReservas/></PrivateRoute>}/>
    </Routes>
  );
};