import React from 'react'


const Card = ({image}) => {
  return (
    <div className=" h-50 w-60  bg-black rounded-lg shadow-lg overflow-hidden border-2 border-blue-600">
      <img src={image}  className=" h-50 w-60 object-cover" />
    </div>
  )
}

export default Card
