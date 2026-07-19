import React from 'react'


const Card = ({image}) => {
  return (
    <div className=" h-70 w-70  bg-black rounded-lg shadow-lg overflow-hidden border-2 border-blue-600 hover:shadow-2xl hover:shadow-blue-400 cursor-pointer hover:border-amber-100">
      <img src={image}  className=" h-full w-full object-cover" />
    </div>
  )
}

export default Card
