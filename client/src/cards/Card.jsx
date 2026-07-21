import React from 'react'

const Card = ({ image }) => {
  return (
    <div className="h-50 w-50 md:h-70 md:w-70 bg-black rounded-lg shadow-lg overflow-hidden border-2 border-blue-600 hover:shadow-2xl hover:shadow-blue-400 hover:border-amber-100 cursor-pointer transition-all">
      <img
        src={image}
        alt="Card"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default Card