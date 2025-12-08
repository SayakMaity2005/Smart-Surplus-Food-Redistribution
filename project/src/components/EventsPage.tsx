import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import emptyEventImage from '../assets/empty-event-digital-ui.jpg';

interface User {
  name: string;
  username: string;
  role: string;
}

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
}

const EventsPage: React.FC = () => {
  // Dummy events data
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddEventPopupOpen, setIsAddEventPopupOpen] = useState<boolean>(false);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState<boolean>(false);
  const [triggeredEvent, setTriggeredEvent] = useState<Event | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [loadMessage, setLoadMessage] = useState<string>("");
  // const [error, setError] = useState<string>("");
  const defaultFormData = {
    title: '',
    description: '',
    location: '',
    event_date: '',
  };
  const [formData, setFormData] = useState(defaultFormData);


  useEffect(() => {
    const checkSessionGetData = async () => {
      try {
        // Session Cheack
        const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
          withCredentials: true,
        });
        setUser(sessionResponse.data.user);
        console.log("Session:", sessionResponse.data);
        // Get data
        const dataResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/admin/get-all-events/", {
          withCredentials: true,
        });
        // sorting according to date
        const sortedEvents = [...dataResponse.data.data].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setEvents(sortedEvents);
        console.log("Session:", dataResponse.data);
      } catch (err) {
        setUser(null);
        navigate('/');
        console.log(err);
      }
    };
    checkSessionGetData();
  }, [refreshPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const isodatetime = new Date(e.target.value).toISOString();
  //   setFormData({ ...formData, [e.target.name]: isodatetime });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/add-event/", {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        event_date: new Date(formData.event_date).toISOString(),
      }, { withCredentials: true });
      console.log("Event Added:", response.data);
      setIsAddEventPopupOpen(false);
      setRefreshPage(!refreshPage);
      setFormData(defaultFormData);
    } catch (err) {
      console.log(err);
    }
    // Submit logic here
  };

  const handleRemoveItem = async (event: Event) => {
    setTriggeredEvent(null);
    try {
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/remove-event/", {
        event_id: event.id
      }, { withCredentials: true });
      console.log("Event Removed:", response.data);
      setRefreshPage(!refreshPage);
    } catch (err) {
      console.log(err);
    }
  };

  // const events = [
  //   {
  //     title: 'Campus Food Drive',
  //     date: '2025-09-10',
  //     location: 'Main Hall',
  //     description: 'Join us for a food drive to support local families. Volunteers needed!',
  //     image: 'https://images.pexels.com/photos/664691/pexels-photo-664691.jpeg',
  //   },
  //   {
  //     title: 'Diwali Donation Fest',
  //     date: '2025-11-01',
  //     location: 'Community Center',
  //     description: 'Celebrate Diwali by donating surplus food and spreading joy.',
  //     image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg',
  //   }
  // ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Upcoming Events</h1>
      <p className="w-full text-gray-600 m-2 text-center">Add new upcoming events here</p>
      <div className="w-full flex justify-center">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow m-2 mb-8" onClick={() => setIsAddEventPopupOpen(true)}>Add New Event</button>
      </div>
      {/* Add event popup */}
      <AnimatePresence>
        {isAddEventPopupOpen && (
          <motion.div
            className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            // onClick={() => setIsAddEventPopupOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div onClick={() => setIsAddEventPopupOpen(false)} className="fixed inset-0 bg-transparent z-50"></motion.div>
            {/* Popup card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 relative w-80 z-50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            // onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-700 hover:text-black font-bold"
                onClick={() => setIsAddEventPopupOpen(false)}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4">New Event</h2>
              <p className="text-gray-700 text-sm">Add a new possible upcoming event to get notified about every time.</p>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows={3} placeholder="A brief description of the event" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Main Campus Canteen, Room 101" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <input name="event_date" type='datetime-local' value={formData.event_date} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 2023-09-15" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">Submit</button>
              </form>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Show added events */}
      <div className="space-y-6">
        <AnimatePresence>
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12">
              <img src={emptyEventImage} alt="No Events" className="w-64 h-64 object-contain mb-4" />
              <p className="text-gray-500">No upcoming events found.</p>
            </div>
          )}
          {events.map((event, idx) => {
            const eventDate = new Date(event.event_date).toString().substring(4, 21);
            const isEventToday = new Date(event.event_date).toDateString() === new Date().toDateString();
            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                // className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 relative"
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden"
              >
                {/* <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" /> */}
                <h2 className="text-xl font-bold text-orange-600 mb-2">{event.title}</h2>
                <p className="text-gray-700 mb-1"><strong>Date:</strong> {eventDate}</p>
                <p className="text-gray-700 mb-1"><strong>Location:</strong> {event.location}</p>
                <p className="text-gray-600">{event.description}</p>
                <div className="flex gap-2 mt-4">
                  {isEventToday && (
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow transition-transform duration-300" onClick={() => navigate('/add-donation')}>Register Leftover</button>
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-yellow-600 shadow">Event</div>
                <button onClick={() => { setIsRemovePopupOpen(true); setTriggeredEvent(event); }} className="absolute bottom-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-red-700 shadow"><Trash2 className="w-4 h-4" /></button>

              </motion.div>
            )
          })}
        </AnimatePresence>
        {/* Remove popup */}
        <AnimatePresence>
          {isRemovePopupOpen && (
            <motion.div
              className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsRemovePopupOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Popup card */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 relative w-80"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 text-gray-700 hover:text-black font-bold"
                  onClick={() => setIsRemovePopupOpen(false)}
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Remove this event?</h2>
                <p className="text-gray-700 text-sm">This event will be removed from database permanently. Proceed with caution.</p>

                <div className="mt-6">
                  {/* {loading && (
                          <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                        )}
                        {(error != "") && (
                          <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                        )} */}
                  <div>
                    <div className="flex items-center my-3 mb-0">
                      <button onClick={() => setIsRemovePopupOpen(false)} className="text-sm my-3 text-blue-700">Cancel</button>
                      <p className="text-sm mx-6 text-gray-500">|</p>
                      <button onClick={() => { handleRemoveItem(triggeredEvent!); setIsRemovePopupOpen(false); }} className="text-sm my-3 text-red-700">Remove</button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventsPage;
