import React from 'react'

const Button = (props) => {
  return (
    <a href={props.link} className="button">{props.name}</a>
  )
}

export default Button
