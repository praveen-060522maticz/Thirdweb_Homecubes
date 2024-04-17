import React from 'react'
import { NavLink } from 'react-router-dom';
import config from '../config/config'

function BlogsCard(props) {
  console.log(props.data, "kuiiiii");
  const { blogImage, blogName, blogDate, blogHint, id, image, title, conten, description, createdAt, slug } = props.data;
  return (
    <>
      <div className='blogsCard mb-3'>
        <NavLink
          to={{ pathname: `/blogInfo/${slug}` }}
          state={props.data}
        >
          <img src={`${config.IMG_URL}/blogImg/${image}`} className='img-fluid blogCard_img' />
        </NavLink>

        <div className='blogCard_body'>
          <p className='blogCard_title mt-3'>{title?.length > 30 ? title?.slice(0, 30).concat('...') : title}</p>
          <p className='markeplace_hint blog_heighthint mt-2' >{description}</p>
          <div className='stack_pendingholder blogCard_date mt-3'>
            <p className="stack_pendinghint">{new Date(createdAt).toDateString()}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogsCard