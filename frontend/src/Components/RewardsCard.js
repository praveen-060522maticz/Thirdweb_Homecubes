import React, { useState } from 'react'

function RewardsCard(props) {
  const { feedTitle, feedDescription, createdAt } = props.data

  const [show, setShow] = useState(false)
  return (
    <>
      <div className='rewards_card'>
        <h6 className='rewards_card-title'>{feedTitle}</h6>
        <p className='rc_dateText '>{new Date(createdAt).toLocaleDateString()}</p>
        <p className='hc-mint__banner--desc '>{!show ? feedDescription.slice(0, 150) : feedDescription}</p>
        <div className='rc_readmore_aligner' >
          <button className="mp_readmoreBtn" onClick={() => setShow(!show)}>{!show ? "Read More" : "Read Less"}</button>
        </div>
      </div>
    </>
  )
}

export default RewardsCard