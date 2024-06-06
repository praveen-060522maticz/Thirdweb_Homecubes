import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { LSgetItem, adminList } from '../../lib/common';

class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  componentDidMount() {
    this.setState({ adminType: LSgetItem("adminType") })
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="index.html"><img src={require('../../assets/images/logo.svg')} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={require('../../assets/images/logomob.svg')} alt="logo" /></a>
        </div>
        <ul className="nav">

          <li className="nav-item nav-category">
            {/* <span className="nav-link"><Trans>Navigation</Trans></span> */}
          </li>
          <li className={this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-speedometer"></i></span>
              <span className="menu-title"><Trans>Dashboard</Trans></span>
            </Link>
          </li>


          <li className={this.isPathActive('/tables') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('tablesMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={true}>
              <div>
                <ul className="nav flex-column sub-menu">
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/projectList') ? 'nav-link active' : 'nav-link'} to="/projectList"><Trans>Project List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/gasManager') ? 'nav-link active' : 'nav-link'} to="/gasManager"><Trans>Gas fee manager</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/gasTokens') ? 'nav-link active' : 'nav-link'} to="/gasTokens"><Trans>Gas Tokens withdraw</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/KycList') ? 'nav-link active' : 'nav-link'} to="/KycList"><Trans>KYC List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/feedList') ? 'nav-link active' : 'nav-link'} to="/feedList"><Trans>News and Feed list</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/faqList') ? 'nav-link active' : 'nav-link'} to="/faqList"><Trans>Faq list</Trans></Link></li>}
                  {/* <li className="nav-item"> <Link className={this.isPathActive('/article') ? 'nav-link active' : 'nav-link'} to="/article"><Trans>Blog list</Trans></Link></li> */}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/aboutuser') ? 'nav-link active' : 'nav-link'} to="/aboutuser"><Trans>AboutUs List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/cmshomelist') ? 'nav-link active' : 'nav-link'} to="/cmshomelist"><Trans>Cms List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/listcontactus') ? 'nav-link active' : 'nav-link'} to="/listcontactus"><Trans>ContactUs List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/blogCategoryList') ? 'nav-link active' : 'nav-link'} to="/blogCategoryList"><Trans>BlogCategory List</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/blogList') ? 'nav-link active' : 'nav-link'} to="/blogList"><Trans>Blog List</Trans></Link></li>}
                  {/* {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/subscriberslist') ? 'nav-link active' : 'nav-link'} to="/subscriberslist"><Trans>Newsletter List</Trans></Link></li>} */}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/mintReport') ? 'nav-link active' : 'nav-link'} to="/mintReport"><Trans>Collection mint report</Trans></Link></li>}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/marketPlaceReport') ? 'nav-link active' : 'nav-link'} to="/marketPlaceReport"><Trans>Marketplace activity report</Trans></Link></li>}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/royaltyReport') ? 'nav-link active' : 'nav-link'} to="/royaltyReport"><Trans>Marketplace royalty report</Trans></Link></li>}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/stackProjects') ? 'nav-link active' : 'nav-link'} to="/stackProjects"><Trans>Stake Projects</Trans></Link></li>}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/rewardProjects') ? 'nav-link active' : 'nav-link'} to="/rewardProjects"><Trans>Reward Projects</Trans></Link></li>}
                  {adminList.includes(LSgetItem("adminType") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/projectRewards') ? 'nav-link active' : 'nav-link'} to="/projectRewards"><Trans>Reward History</Trans></Link></li>}
                  {/* {adminList.includes(LSgetItem("currencylist") ?? "") && <li className="nav-item"> <Link className={this.isPathActive('/currencylist') ? 'nav-link active' : 'nav-link'} to="/currencylist"><Trans>Currency list</Trans></Link></li>} */}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/currencylist') ? 'nav-link active' : 'nav-link'} to="/currencylist"><Trans>Currency list</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/whitelists') ? 'nav-link active' : 'nav-link'} to="/whitelists"><Trans>Whitelist Users</Trans></Link></li>}
                  {LSgetItem("adminType") == adminList[0] && <li className="nav-item"> <Link className={this.isPathActive('/adminList') ? 'nav-link active' : 'nav-link'} to="/adminList"><Trans>Admin role List</Trans></Link></li>}
                  
                  





                  {/* <li className="nav-item"> <Link className={this.isPathActive('/promotionlist') ? 'nav-link active' : 'nav-link'} to="/promotionlist"><Trans>Promotion List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/categorylist') ? 'nav-link active' : 'nav-link'} to="/categorylist"><Trans>Category List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/currencylist') ? 'nav-link active' : 'nav-link'} to="/currencylist"><Trans>Currency List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/cmsandfaq') ? 'nav-link active' : 'nav-link'} to="/cmsandfaq"><Trans>Cms And List Faq</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/subscriberslist') ? 'nav-link active' : 'nav-link'} to="/subscriberslist"><Trans>Subscribers List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/sociallist') ? 'nav-link active' : 'nav-link'} to="/sociallist"><Trans>Social List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/servicefee') ? 'nav-link active' : 'nav-link'} to="/servicefee"><Trans>Service Fee Management</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/userlist') ? 'nav-link active' : 'nav-link'} to="/userlist"><Trans>User List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/faqlist') ? 'nav-link active' : 'nav-link'} to="/faqlist"><Trans>FAQ List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/reportlist') ? 'nav-link active' : 'nav-link'} to="/reportlist"><Trans>Report Token List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/nfttaglist') ? 'nav-link active' : 'nav-link'} to="/nfttaglist"><Trans>Nft Tag List</Trans></Link></li> */}
                  {/* <li className="nav-item"> <Link className={ this.isPathActive('/artist-list') ? 'nav-link active' : 'nav-link' } to="/artist-list"><Trans>Artist List</Trans></Link></li> */}
                  {/* <li className="nav-item"> <Link className={this.isPathActive('/tokenlist') ? 'nav-link active' : 'nav-link'} to="/tokenlist"><Trans>Token List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/emailtemplatelist') ? 'nav-link active' : 'nav-link'} to="/emailtemplatelist"><Trans>Email Template List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/article') ? 'nav-link active' : 'nav-link'} to="/article"><Trans>Article List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/aboutuser') ? 'nav-link active' : 'nav-link'} to="/aboutuser"><Trans>About User List</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/referral') ? 'nav-link active' : 'nav-link'} to="/referral"><Trans>Referral</Trans></Link></li> */}

                  {/* <li className="nav-item"> <Link className={ this.isPathActive('/npo-list') ? 'nav-link active' : 'nav-link' } to="/npo-list"><Trans>Non profit organisation</Trans></Link></li> */}
                  {/* <li className="nav-item"> <Link className={ this.isPathActive('/promo-drops') ? 'nav-link active' : 'nav-link' } to="/promo-drops"><Trans> Free Drops </Trans></Link></li> */}


                </ul>
              </div>
            </Collapse>
          </li>




        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);
