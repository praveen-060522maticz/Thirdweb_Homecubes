<Switch>
<Route exact path="/" component={Login} />

<Route exact path="/dashboard" component={ Dashboard } />

<Route path="/form-Elements/basic-elements" component={ BasicElements } />

<Route path="/tables/multiple-image-upload-table" component={ BasicTable } />
<Route path="/tables/cms-table" component={ BasicTable } />
<Route path="/tables/faq-table" component={ BasicTable } />
<Route path="/nftdetails" component={ Nfttable } />

<Route path="/droplist" component={ Nfttable } />
<Route path="/markettokens" component={ MarketTokens } />


{/* <Route path="/nftdetails" component={ NftDetail } /> */}


<Route path="/login/superadmin" component={ Login } />
<Route path="/login/admin" component={ Login } />
<Route path="/login/user" component={ Login } />
{/* <Route path="/login" component={ Login } /> */}
<Route path="/register" component={ Login } />
<Route path="/superadmin" component={ Super } />
<Route path="/connectwallet" component={ WalletConnect } />







<Redirect to="/dashboard" />
</Switch>