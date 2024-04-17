import React, { Component, Suspense, lazy, useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getInitialProps } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import WalletConnect from '../connectwallet/connectwallet.js';


import { WALLET_CONNECT, WALLET_DISCONNECT } from '../redux/action.js';

import Spinner from '../app/shared/Spinner';


// public private routes

import AdminRoute from './authRoutes/adminRoutes.js';

import Routes from './authRoutes/commonRoutes.js';




export default function AppRoutes(props) {

	var token = localStorage.token;
	console.log("token in app routes", token)
	const isAuthenticated = token ? true : false
	const adminRoutes = Routes.map(({ path, component, name }, key) => <Route exact path={path} component={component} key={key} name={name} />)



	return (
		<>
			<Suspense fallback={<Spinner />}>
				<Switch>
					<AdminRoute
						isAuth={isAuthenticated}>
						{adminRoutes}
					</AdminRoute>
				</Switch>
			</Suspense>
			<div className="modal fade primary_modal" id="connect_modal" role="dialog" aria-labelledby="connect_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"   >
				<div className="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div className="modal-content">
						<div className="modal-header text-center">
							<h5 className="modal-title" id="connect_modalLabel">Connect Your Wallet</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

					</div>
				</div>
			</div>
		</>

	);

}


