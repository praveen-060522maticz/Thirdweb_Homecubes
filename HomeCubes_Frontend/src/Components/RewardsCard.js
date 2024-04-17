import React, { useState } from 'react'

function RewardsCard(props) {
  const { feedTitle, feedDescription, createdAt } = props.data

  const [show, setShow] = useState(false)
  return (
    <>
      <div className='rewards_card'>
        <h6>{feedTitle}</h6>
        <p className='rc_dateText mt-2'>{new Date(createdAt).toLocaleDateString()}</p>
        <p className='mp_detailbrief mint_scrollText'>{!show ? feedDescription.slice(0, 150) : feedDescription}</p>
        <div className='rc_readmore_aligner' onClick={() => setShow(!show)} >
          <button className="mp_readmoreBtn">{!show ? "Read More" : "Read Less"}</button>
        </div>
      </div>
    </>
  )
}

export default RewardsCard