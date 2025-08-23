import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventsPage: React.FC = () => {
  // Dummy events data
  const navigate = useNavigate();

  const events = [
    {
      title: 'Campus Food Drive',
      date: '2025-09-10',
      location: 'Main Hall',
      description: 'Join us for a food drive to support local families. Volunteers needed!',
      image: 'https://images.pexels.com/photos/664691/pexels-photo-664691.jpeg',
    },
    {
      title: 'Diwali Donation Fest',
      date: '2025-11-01',
      location: 'Community Center',
      description: 'Celebrate Diwali by donating surplus food and spreading joy.',
      image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg',
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Upcoming Events</h1>
      <div className="space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
            {/* <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" /> */}
            <h2 className="text-xl font-bold text-orange-600 mb-2">{event.title}</h2>
            <p className="text-gray-700 mb-1"><strong>Date:</strong> {event.date}</p>
            <p className="text-gray-700 mb-1"><strong>Location:</strong> {event.location}</p>
            <p className="text-gray-600">{event.description}</p>
            <div className="flex gap-2 mt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow transition-transform duration-300" onClick={() => navigate('/add-donation')}>Register Leftover</button>
            </div>
            <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-orange-700 shadow">Event</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
