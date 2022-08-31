/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { useJwt } from 'react-jwt';
import toast, { Toaster } from 'react-hot-toast';

const AuthContext = React.createContext({
  token: '',
  isLogin: false,
  login: () => {},
  logout: () => {},
  isExpired: false,
});

export function AuthContextProvider(props) {
  const tokenData = localStorage.getItem('token');

  const [authToken, setAuthToken] = useState(tokenData);
  const { isExpired } = useJwt(tokenData);

  const userIsLogIn = !!authToken;

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (isExpired) {
      handleLogout();
      toast.error('토큰이 만료되었습니다.');
    }
  }, [isExpired]);

  // useEffect(() => {
  //   window.onbeforeunload = () => {
  //     localStorage.clear();
  //   };
  // }, []);

  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
  };

  const contextValue = {
    token: authToken,
    isLogin: userIsLogIn,
    login: handleLogin,
    logout: handleLogout,
    isExpired,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
      <Toaster
        containerStyle={{
          top: 30,
        }}
      />
    </AuthContext.Provider>
  );
}

export default AuthContext;
