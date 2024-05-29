import React from 'react'
import {Link , Outlet} from 'react-router-dom'

function Nav() {
  return (
    <>
      <nav>
        <ul>
            <li>
            <Link to = '/reg'>Registration</Link>
            </li>
            <li>
            <Link to = '/home'>Home</Link>
            </li>
            <li>
            <Link to = '/contact'>Contact</Link>
            </li>
            <li>
            <Link to = '/booklist'>Booklist</Link>
            </li>
        </ul>
      </nav>
      <Outlet/>
    </>
  )
}

export default Nav;