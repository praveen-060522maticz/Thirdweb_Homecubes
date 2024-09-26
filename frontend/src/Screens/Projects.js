import React, { useEffect, useRef, useState } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Col, Container, Row, Button } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import ProjectCard from '../Components/ProjectCard'
import { nftcard } from '../datas/CardData'
import Footer from '../Components/Footer'
import BreadPath from '../Components/BreadPath'
import { getProjects } from '../actions/axioss/nft.axios'
import { getDaysOfDesiredMonth } from '../actions/common'
import { getCmsContent } from '../actions/axioss/cms.axios'
import mintBg from '../assets/images/mintBg.png'
import { useNavigate } from 'react-router-dom'

function Projects() {

  const [search, setSearch] = useState('')
  const [mobSearch, setMobSearch] = useState(false);
  const filterData = search == '' ? nftcard?.projectCard : nftcard?.projectCard.filter(val => val.name.toLowerCase().includes(search.toLowerCase()));
  console.log(filterData, "filterData");

  const [Projects, setProjects] = useState([]);
  const [isFixed, setIsFixed] = useState(true);
  const footerRef = useRef(null);
  const [nftLength, setnftLength] = useState(0);
  const [staked, setstaked] = useState(0);
  const [unStaked, setunStaked] = useState(0);
  const [projectLength, setProjectLength] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    getAllProjects()
  }, [search])

  const getAllProjects = async () => {
    const Resp = await getProjects({ keyWord: search });
    console.log("Resp on getAllProjects", Resp);
    setProjects(Resp?.data ?? []);
    setnftLength(Resp?.nftLength ?? 0)
    setstaked(Resp?.staked ?? 0)
    setunStaked(Resp?.unStaked ?? 0)
    if (projectLength == 0) setProjectLength(Resp?.data?.length)
  }


  const [rewardDetail, setRewardDetail] = useState({});

  useEffect(() => {
    const getData = [
      { label: "90 days", value: "Season 1", poolId: 1, daysDifference: getDaysOfDesiredMonth(3).days, endDateFormat: getDaysOfDesiredMonth(3).dateFormat, startDate: getDaysOfDesiredMonth(3).startDate, poolDay: getDaysOfDesiredMonth(3).newStartDate },
      { label: "190 days", value: "Season 2", poolId: 2, daysDifference: getDaysOfDesiredMonth(6).days, endDateFormat: getDaysOfDesiredMonth(6).dateFormat, startDate: getDaysOfDesiredMonth(6).startDate, poolDay: getDaysOfDesiredMonth(6).newStartDate },
      { label: "360 days", value: "Season 3", poolId: 3, daysDifference: getDaysOfDesiredMonth(12).days, endDateFormat: getDaysOfDesiredMonth(12).dateFormat, startDate: getDaysOfDesiredMonth(12).startDate, poolDay: getDaysOfDesiredMonth(12).newStartDate }
    ]
    const set = getData.filter((val) => val.daysDifference)[0]
    console.log("seifuhseoif", set);
    setRewardDetail(set)
  }, [])


  useEffect(() => {
    getCmsContentFunc();
  }, []);

  const [CMS, SetCMS] = useState({});


  const getCmsContentFunc = async () => {
    const Resp = await getCmsContent({
      page: ["Home Cubes Projects"],
    });
    console.log("sejhfgeiusf", Resp);
    SetCMS(Resp?.data?.[0] ?? {});
  };
  console.log("CMS", CMS);


  const handleScroll = () => {

    const footerTop = footerRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      setIsFixed(false);


    } else {
      setIsFixed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BottomBar />
      <Header />


      <div className='innercontent '>
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className='banner_section banner_section_content project_section'>
          <div className='px-0 inner-container__width'>
            <h3 className='hc-home__title home_titled'>All <strong>Listed Properties</strong></h3>
            {/* <p className='mp_detailbrief hc-home__desc mt-3' dangerouslySetInnerHTML={{ __html: CMS?.content }} ></p> */}
            <hr className='projects_hr' />

            <div className=' projects__details'>
              <div className="projects__details-row order-4 order-xl-1">
                <p className="projects__detatils-row--label">Properties :</p>
                <p className="projects__detatils-row--value">{projectLength}</p>
              </div>
              <div className="projects__details-row order-1 order-xl-2">
                <p className="projects__detatils-row--label">NFTs :</p>
                <p className="projects__detatils-row--value">{nftLength}</p>
              </div>
              <div className="projects__details-row order-2 order-xl-3">
                <p className="projects__detatils-row--label">Staked NFTs :</p>
                <p className="projects__detatils-row--value">{staked}</p>
              </div>
              <div className="projects__details-row order-3 order-xl-4">
                <p className="projects__detatils-row--label">Non-Staked NFTs :</p>
                <p className="projects__detatils-row--value">{unStaked}</p>
              </div>
              <div className="projects__details-row order-5 order-xl-5">
                <p className="projects__detatils-row--label">Next Rewards Distribution :</p>
                <p className="projects__detatils-row--value"> {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}</p>
              </div>
            </div>

            <div className='projects__list'>
              <h6 className='hc-home__title home_titled'><strong>Properties </strong> List</h6>


              <div className="project__list--searchContainer">
                <div className="d-flex justify-content-start align-items-center project__list--search">
                  <img
                    className="searchglass"
                    src={require("../assets/images/searchs.svg").default} />
                  <input type='text' className='stack_search' value={search} placeholder='Search Properties' onChange={(e) => setSearch(e.target.value)} />
                  {/* <ReactSearchBox
                                  placeholder="Search..."
                                  value={search}
                                  data={data}
                                  onChange={(e) => setSearch(e)}
                                  callback={(record) => console.log(record)}
                                /> */}
                </div>
                <i
                  class="fa-solid fa-xmark projects__list--searchCloser"
                  onClick={() => { setMobSearch(false); setSearch('') }}
                />
              </div>
              {/* <div
                className={
                  mobSearch ? "d-none" : " stack_searchbarmob"
                }
                onClick={() => setMobSearch(true)}
              >
                <img
                  className="searchglass"
                  src={
                    require("../assets/images/searchglass.svg")
                      .default
                  }
                />
              </div> */}

            </div>

            <div className='project__list-cards'>
              <div className='mp-grid projectmp_grid'>
                {Projects.length != 0 && Projects.map((i) =>
                  <ProjectCard data={i} show={true} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className='project_bottom_section-empty'></div> */}
        <div className='mp-margin d-flex justify-content-center'>
          <button className='button-loadMore'>Load More</button>
        </div>
      </div >
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  )
}

export default Projects