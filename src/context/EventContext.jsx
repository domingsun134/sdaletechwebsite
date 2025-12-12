import React, { createContext, useState, useEffect, useContext } from 'react';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const addEvent = async (event) => {
        try {
            const response = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
            if (!response.ok) throw new Error('Failed to add event');
            const newEvent = await response.json();
            setEvents(prev => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            console.error('Error adding event:', err);
            throw err;
        }
    };

    const updateEvent = async (id, updatedEvent) => {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvent)
            });
            if (!response.ok) throw new Error('Failed to update event');
            const savedEvent = await response.json();
            setEvents(prev => prev.map(event => event.id === id ? savedEvent : event));
            return savedEvent;
        } catch (err) {
            console.error('Error updating event:', err);
            throw err;
        }
    };

    const deleteEvent = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete event');
            setEvents(prev => prev.filter(event => event.id !== id));
        } catch (err) {
            console.error('Error deleting event:', err);
            throw err;
        }
    };

    return (
        <EventContext.Provider value={{ events, loading, error, addEvent, updateEvent, deleteEvent }}>
            {children}
        </EventContext.Provider>
    );
};
