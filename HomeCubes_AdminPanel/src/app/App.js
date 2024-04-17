import React, { Component, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./App.scss";
import "../assets/styles/styles.css";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";
import Footer from "./shared/Footer";
import { getInitialProps, withTranslation } from "react-i18next";
import WalletConnect from "../connectwallet/connectwallet.js";

function App(props) {
  //  console.log=()=>{};
  //   console.warning = ()=>{}
  //   console.error=()=>{}
  //   console.info =()=>{}

  const location = useLocation();

  // state={}

  const [isFullPageLayout, setIsFullPageLayout] = useState(false);
  const [sideBar, setSideBar] = useState(false);

  useEffect(() => {
    getinit();
  }, [location, sideBar]);

  const getinit = () => {
    onRouteChanged();
    hidesidebar();
  };

  const hidesidebar = () => {
    if (localStorage.adminlogin && localStorage.adminlogin == "yes") {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  };

  const onRouteChanged = () => {
    console.log("ROUTE CHANGED");
    const { i18n } = props;
    const body = document.querySelector("body");
    if (location.pathname === "/layout/RtlLayout") {
      body.classList.add("rtl");
      i18n.changeLanguage("ar");
    } else {
      body.classList.remove("rtl");
      i18n.changeLanguage("en");
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      "/user-pages/login-1",
      "/user-pages/login-2",
      "/user-pages/register-1",
      "/user-pages/register-2",
      "/user-pages/lockscreen",
      "/error-pages/error-404",
      "/error-pages/error-500",
      "/general-pages/landing-page",
    ];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (location.pathname === fullPageLayoutRoutes[i]) {
        setIsFullPageLayout(true);
        document
          .querySelector(".page-body-wrapper")
          .classList.add("full-page-wrapper");
        break;
      } else {
        setIsFullPageLayout(true);

        document
          .querySelector(".page-body-wrapper")
          .classList.remove("full-page-wrapper");
      }
    }
  };

  let navbarComponent = isFullPageLayout ? <Navbar /> : "";
  let sidebarComponent = isFullPageLayout ? <Sidebar /> : "";
  let footerComponent = isFullPageLayout ? <Footer /> : "";
  return (
    <div className="container-scroller custom_container_scroll">
      {sideBar && <Sidebar />}

      <div className="container-fluid page-body-wrapper">
        {navbarComponent}
        <div className="main-panel">
          <div className="content-wrapper">
            <AppRoutes />
          </div>
          {footerComponent}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(withRouter(App));
