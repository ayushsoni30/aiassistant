import React from 'react'
import Card from '../cards/Card'
import image from '../assets/image.png'

import image3 from '../assets/image3.avif'

import image5 from '../assets/image5.jpg'

const Customize = () => {
  return (
<div className="w-full h-screen bg-linear-to-t from-black to-blue-600 p-5 flex justify-center items-center  gap-4">
      <Card image={image5} />
      <Card image={image3} />
       
    </div>
  )
}

export default Customize
