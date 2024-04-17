import React from 'react'
import { Pagination } from 'react-bootstrap';

function PageCounter() {
  let active = 1;
  let items = [];
  for (let number = 1; number <= 4; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <Pagination className='boot_pagination'>
      <Pagination.First />
      <Pagination.Prev />
      {items}
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  )
}

export default PageCounter