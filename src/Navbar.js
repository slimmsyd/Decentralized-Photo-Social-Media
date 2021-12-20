import React from 'react'

export const Navbar = (props) => {
  return (
    <div>
      <nav className='nav'>
        <h1 className ="weDream">WeDream</h1>
        <ul>
          <li>
          {props.currentAccount}
          </li>
          <li>
          {props.chainId}
          </li>
        </ul>
        
      </nav>
    </div>
  )
}
