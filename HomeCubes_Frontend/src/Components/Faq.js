import React from 'react'
import { Accordion } from 'react-bootstrap'
import { nftcard } from '../datas/CardData'

function Faq(props) {
  return (
    <>

      <h3 className="home_titled text-center" data-aos="fade-up" data-aos-offset="100" data-aos-duration="800">Frequently Asked Questions</h3>

      <Accordion defaultActiveKey="" className='about_accordion mt-5' flush>
        {props?.arrData?.length != 0 && props?.arrData?.map((data, index) =>
          <Accordion.Item eventKey={index + 1} className='mb-4'>
            <Accordion.Header>
              <div className='about_accordIndex'><p>{index + 1}</p> {data.question}</div> <i class="fa-solid fa-angle-down about_accorddown" /></Accordion.Header>
            <Accordion.Body dangerouslySetInnerHTML={{ __html: data.answer }} >
            </Accordion.Body>
          </Accordion.Item>
        )}


      </Accordion>

    </>
  )
}

export default Faq