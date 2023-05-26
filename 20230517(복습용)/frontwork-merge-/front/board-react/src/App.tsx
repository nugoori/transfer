import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Routes, useLocation } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import { Box, Grid } from '@mui/material'

import './App.css';
import { useUserStore } from './stores';
import { GET_USER_URL, authorizationHeader } from './constants/api';
import ResponseDto from './apis/response';
import { GetUserResponseDto } from './apis/response/user';
import Main from './Views/Main';
import Menus from './Views/Menus';
import NavigationBar from './Views/NavigationBar';
import AuthenticationView from './Views/AuthenticationView'
import BoardWriteView from './Views/Board/BoardWriteView';
import BoardUpdateView from './Views/Board/BoradUpdateView';
import ProductWriteView from './Views/Product/ProductWriteView';
import WriteView from './Views/WriteView';

function App() {

  const path = useLocation();
  const { setUser } = useUserStore();
  const [cookies] = useCookies();

const getUser = (accessToken: string) => {
  axios.get(GET_USER_URL, authorizationHeader(accessToken))
  .then((response) => getUserResponseHandler(response))
  .catch((error) => getUserErrorHandler(error));
}

const getUserResponseHandler = (response: AxiosResponse<any, any>) => {
  const { result, message, data } = response.data as ResponseDto<any>;
  if (!result || !data) {
    return;
  }
  const user = data as GetUserResponseDto;
  setUser(user);
}

const getUserErrorHandler = (error: any) => {
  console.log(error.message);
}

useEffect(() => {
  const accessToken = cookies.accessToken;
  if (accessToken) getUser(accessToken);
}, [path]);

  return (
    <>
      <Box flexGrow={1}>
        <NavigationBar />
        <Grid container spacing={2} margin={0}>
          <Grid xs={2} sm={0}>
            <Menus />
          </Grid>
          <Grid xs={10}>
          <Routes>
            <Route path='/' element={(<Main />)} />
            <Route path='/auth' element={(<AuthenticationView />)} />
            {/* <Route path='/myPage' element={(<MyPageView />)} /> */}
            <Route path='/board'>
              <Route path='post-board' element={(<WriteView />)} />
              {/* <Route path='search/:content' element={(<SearchView />)} />
              <Route path='detail/:boardNumber' element={(<BoardDetailView />)} /> */}
              {/* <Route path='update/:boardNumber' element={(<BoardUpdateView />)} /> */}
            </Route>
            
          </Routes>
          {/* { path.pathname !== '/auth' && (<Footer />) } */}
          </Grid>
          
        </Grid>
      </Box>
    </>
  );
}

export default App;
