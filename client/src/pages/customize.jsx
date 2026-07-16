import React from 'react'
import Card from '../cards/Card'
import image from '../assets/image.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.avif'
import image4 from '../assets/image4.webp'
import image5 from '../assets/image5.jpg'

const Customize = () => {
  return (
<div className="w-full h-screen bg-linear-to-t from-black to-blue-600 p-5 flex flex-wrap gap-4">
      <Card image={image5} />
      <Card image={image3} />
       <p className='font-bold text-2xl text-amber-700 ml-10'>More? commping soon.....</p>
    </div>
  )
}

export default Customize
