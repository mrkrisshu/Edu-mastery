import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
}

interface NewEventForm {
  title: string;
  date: string;
  time: string;
  duration: string;
}

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([
    { id: 1, title: 'Study React', date: '2023-09-15', time: '09:00', duration: '2 hours' },
    { id: 2, title: 'Practice Problem Solving', date: '2023-09-15', time: '14:00', duration: '1 hour' },
    { id: 3, title: 'Review Flashcards', date: '2023-09-16', time: '10:00', duration: '30 minutes' }
  ]);

  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: '',
    date: '',
    time: '',
    duration: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const eventToAdd: ScheduleEvent = { 
        id: Date.now(), 
        ...newEvent 
      };
      setEvents(prev => [...prev, eventToAdd]);
      setNewEvent({ title: '', date: '', time: '', duration: '' });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Study Schedule</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Add New Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={newEvent.time}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={newEvent.duration}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="e.g. 1 hour"
            />
          </div>
        </div>
        <button
          onClick={handleAddEvent}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Add Event
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Upcoming Events</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date} at {event.time} ({event.duration})
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete event"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="p-6 text-gray-500 dark:text-gray-400">No scheduled events yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;