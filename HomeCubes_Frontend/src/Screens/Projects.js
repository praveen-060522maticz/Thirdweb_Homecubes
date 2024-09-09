import React, { useEffect, useState } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Col, Container, Row } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import ProjectCard from '../Components/ProjectCard'
import { nftcard } from '../datas/CardData'
import Footer from '../Components/Footer'
import BreadPath from '../Components/BreadPath'
import { getProjects } from '../actions/axioss/nft.axios'
import { getDaysOfDesiredMonth } from '../actions/common'
import { getCmsContent } from '../actions/axioss/cms.axios'

function Projects() {

  const [search, setSearch] = useState('')
  const [mobSearch, setMobSearch] = useState(false);
  const filterData = search == '' ? nftcard?.projectCard : nftcard?.projectCard.filter(val => val.name.toLowerCase().includes(search.toLowerCase()));
  console.log(filterData, "filterData");

  const [Projects, setProjects] = useState([]);
  const [nftLength, setnftLength] = useState(0);
  const [staked, setstaked] = useState(0);
  const [unStaked, setunStaked] = useState(0);
  const [projectLength, setProjectLength] = useState(0)

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

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className='pt-3 home_wrapper hc-section__inner'>
        <Container className='custom_container '>
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className='res_pad_aligner mt-3'>
              {/* <BreadPath/> */}
              <h3 className='hc-home__title home_titled'>All <strong>Listed Properties</strong></h3>
              <p className='mp_detailbrief hc-home__desc mt-3' dangerouslySetInnerHTML={{ __html: CMS?.content }} ></p>
              <hr className='projects_hr' />

              <div className='d-flex flex-wrap align-items-center gap-4 gap-xl-5'>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Number of NFTs :</p>
                  <p className="mp_collectionValue">{nftLength}</p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Number of Staked NFTs :</p>
                  <p className="mp_collectionValue">{staked}</p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Number of Non-Staked NFTs :</p>
                  <p className="mp_collectionValue">{unStaked}</p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Next Rewards Distribution :</p>
                  <p className="mp_collectionValue"> {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}</p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Number of Projects :</p>
                  <p className="mp_collectionValue">{projectLength}</p>
                </div>
              </div>

              <Row className='mt-5'>
                <h6 className='hc-home__title home_titled'><strong>Properties </strong> List</h6>
                <Col lg={4} md={6} sm={6} xs={12} className='mt-4'>
                  <div
                    className={
                      mobSearch
                        ? "stack_searchbar"
                        : " stack_searchbar stack_searchbarhider"
                    }
                  >
                    <div className="d-flex justify-content-start align-items-center width_aligner">
                      <img
                        className="searchglass"
                        src={
                          require("../assets/images/searchglass.svg")
                            .default
                        }
                      />
                      <input type='text' className='stack_search' value={search} placeholder='Search...' onChange={(e) => setSearch(e.target.value)} />
                      {/* <ReactSearchBox
                                  placeholder="Search..."
                                  value={search}
                                  data={data}
                                  onChange={(e) => setSearch(e)}
                                  callback={(record) => console.log(record)}
                                /> */}
                    </div>
                    <i
                      class="fa-solid fa-xmark search_closer"
                      onClick={() => { setMobSearch(false); setSearch('') }}
                    />
                  </div>

                  <div
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
                  </div>
                </Col>
              </Row>

              <Row className='mt-4'>
                {Projects.length != 0 && Projects.map((i) =>
                  <Col xl={3} lg={4} md={6} sm={6} xs={12} className='mb-3 d-flex justify-content-center justify-content-md-start'>
                    <ProjectCard data={i} show={true} />
                  </Col>
                )}

              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
      <div className='gradient_holder'></div>
    </>
  )
}

export default Projects