import React, { Component ,useState, useEffect } from 'react';

import {
    Route,
    Redirect
  } from 'react-router-dom';

import Login from '../loginpages/Login.js';


  function adminRoute({ children, isAuth,isAdmin, ...rest  }) {
     console.log("sadsadsadsa", isAuth )
    return (
      <Route
        {...rest}
        render={
          ({ location }) => (
            (isAuth) ? (
              children
            ) : (
             <Login/>
             
            )
            )
        }
      />
    );
  }
  
  export default adminRoute;