import React from 'react'
import UserLayout from './user/UserLayout'

function AboutUs() {
  return (

    <div className="flex justify-center items-center h-screen">
    <div className="text-center border border-gray-300 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <div className="max-w-md">
        <p className="mb-4">Mission Statement: At Kerala Tourism, we are passionate about showcasing the natural beauty, cultural richness, and warm hospitality of Kerala to travelers worldwide. Our mission is to curate unforgettable travel experiences, promote responsible tourism practices, and empower local communities, ensuring that every visitor to Kerala leaves with memories to cherish for a lifetime.</p>
        <p>Company Overview: Founded in [year], Kerala Tourism is a premier online platform dedicated to promoting tourism in Kerala, India's enchanting southern state. Nestled between the Arabian Sea and the Western Ghats, Kerala is renowned for its serene backwaters, lush hill stations, vibrant culture, and delectable cuisine. Our team of seasoned travelers and tourism experts is committed to unlocking the wonders of Kerala for travelers from across the globe.</p>
      </div>
    </div>
  </div>

  

  )
}

export default AboutUs