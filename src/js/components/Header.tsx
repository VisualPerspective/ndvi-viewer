import * as React from 'react'
import constants from '../constants'

const Header = () => (
  <header>
    <h1>{constants.HEADING}</h1>
    <p className='form-line'>
      <span>Show </span>
      <select>
        <option>timeline</option>
        <option>grid</option>
      </select>
      <span> of </span>
      <select>
        <option>NDVI</option>
        <option>NDVI trend</option>
        <option>NDVI anomoly</option>
      </select>
      <span> by </span>
      <select>
        <option>month</option>
        <option>year</option>
      </select>
    </p>
  </header>
)

export default Header