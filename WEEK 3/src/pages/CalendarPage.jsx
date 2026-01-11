import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  Film,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { isDark } = useTheme();
  const { permissions } = useAuth();
  const { logAction } = useAudit();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Movie Screening: Avengers: Endgame',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 12, 0),
      movie: 'Avengers: Endgame',
      theater: 'Theater 1',
      capacity: 200,
      ticketsSold: 180,
      price: 15,
      genre: 'Action',
    },
    {
      id: 2,
      title: 'Movie Screening: Inception',
      start: new Date(2024, 0, 16, 14, 0),
      end: new Date(2024, 0, 16, 16, 30),
      movie: 'Inception',
      theater: 'Theater 2',
      capacity: 150,
      ticketsSold: 120,
      price: 12,
      genre: 'Sci-Fi',
    },
    {
      id: 3,
      title: 'Special Event: Movie Premiere',
      start: new Date(2024, 0, 17, 18, 0),
      end: new Date(2024, 0, 17, 20, 0),
      movie: 'Dune: Part Two',
      theater: 'IMAX Theater',
      capacity: 300,
      ticketsSold: 295,
      price: 20,
      genre: 'Sci-Fi',
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    movie: '',
    theater: '',
    capacity: '',
    price: '',
    genre: '',
    start: '',
    end: '',
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; // Default blue

    switch (event.genre) {
      case 'Action':
        backgroundColor = '#ef4444'; // Red
        break;
      case 'Comedy':
        backgroundColor = '#f59e0b'; // Yellow
        break;
      case 'Drama':
        backgroundColor = '#8b5cf6'; // Purple
        break;
      case 'Sci-Fi':
        backgroundColor = '#06b6d4'; // Cyan
        break;
      case 'Horror':
        backgroundColor = '#7c3aed'; // Violet
        break;
      default:
        backgroundColor = '#6b7280'; // Gray
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setIsEditing(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!permissions.canManageMovies) return;

    setEventForm({
      title: '',
      movie: '',
      theater: '',
      capacity: '',
      price: '',
      genre: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
    });
    setSelectedEvent(null);
    setShowEventModal(true);
    setIsEditing(false);
  };

  const handleSaveEvent = () => {
    const eventData = {
      ...eventForm,
      start: new Date(eventForm.start),
      end: new Date(eventForm.end),
      ticketsSold: 0, // New events start with 0 tickets
    };

    if (isEditing && selectedEvent) {
      setEvents(events.map(event =>
        event.id === selectedEvent.id
          ? { ...event, ...eventData, id: selectedEvent.id }
          : event
      ));
      logAction('MOVIE_SCREENING_UPDATED', `Updated screening: ${eventData.movie} in ${eventData.theater}`);
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now(),
        title: `Movie Screening: ${eventData.movie}`,
      };
      setEvents([...events, newEvent]);
      logAction('MOVIE_SCREENING_CREATED', `Created new screening: ${eventData.movie} in ${eventData.theater}`);
    }

    setShowEventModal(false);
    setEventForm({
      title: '',
      movie: '',
      theater: '',
      capacity: '',
      price: '',
      genre: '',
      start: '',
      end: '',
    });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && permissions.canManageMovies) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      logAction('MOVIE_SCREENING_DELETED', `Deleted screening: ${selectedEvent.movie} in ${selectedEvent.theater}`);
      setShowEventModal(false);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent && permissions.canManageMovies) {
      setEventForm({
        title: selectedEvent.title,
        movie: selectedEvent.movie,
        theater: selectedEvent.theater,
        capacity: selectedEvent.capacity,
        price: selectedEvent.price,
        genre: selectedEvent.genre,
        start: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm'),
        end: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm'),
      });
      setIsEditing(true);
    }
  };

  const occupancyRate = useMemo(() => {
    if (!selectedEvent) return 0;
    return Math.round((selectedEvent.ticketsSold / selectedEvent.capacity) * 100);
  }, [selectedEvent]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Movie Scheduling Calendar</h1>
        {permissions.canManageMovies && (
          <button
            onClick={() => {
              setEventForm({
                title: '',
                movie: '',
                theater: '',
                capacity: '',
                price: '',
                genre: '',
                start: moment().format('YYYY-MM-DDTHH:mm'),
                end: moment().add(2, 'hours').format('YYYY-MM-DDTHH:mm'),
              });
              setSelectedEvent(null);
              setShowEventModal(true);
              setIsEditing(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Screening</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={permissions.canManageMovies}
          className={`rbc-calendar ${isDark ? 'dark' : ''}`}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
        />
      </div>

      {/* Event Details Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Screening' : selectedEvent ? 'Screening Details' : 'Add New Screening'}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedEvent && !isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Film className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.movie}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 dark:text-white">{selectedEvent.theater}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900 dark:text-white">
                      {moment(selectedEvent.start).format('MMM DD, YYYY HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="text-gray-900 dark:text-white">
                        {selectedEvent.ticketsSold}/{selectedEvent.capacity} tickets
                      </span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{occupancyRate}% occupied</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-red-600" />
                    <span className="text-gray-900 dark:text-white">${selectedEvent.price} per ticket</span>
                  </div>

                  {permissions.canManageMovies && (
                    <div className="flex space-x-2 pt-4">
                      <button
                        onClick={handleEditEvent}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDeleteEvent}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Movie Title
                    </label>
                    <input
                      type="text"
                      value={eventForm.movie}
                      onChange={(e) => setEventForm({ ...eventForm, movie: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter movie title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Theater
                      </label>
                      <input
                        type="text"
                        value={eventForm.theater}
                        onChange={(e) => setEventForm({ ...eventForm, theater: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Theater name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Genre
                      </label>
                      <select
                        value={eventForm.genre}
                        onChange={(e) => setEventForm({ ...eventForm, genre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select genre</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Horror">Horror</option>
                        <option value="Romance">Romance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        value={eventForm.capacity}
                        onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={eventForm.price}
                        onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.start}
                        onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.end}
                        onChange={(e) => setEventForm({ ...eventForm, end: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handleSaveEvent}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      {isEditing ? 'Update Screening' : 'Add Screening'}
                    </button>
                    <button
                      onClick={() => setShowEventModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;