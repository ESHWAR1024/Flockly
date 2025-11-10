import React, { useEffect, useState } from "react";

export default function ViewEvent({ eventId, onBack, onRegister }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    // Check if user has already registered for this event
    const registered = localStorage.getItem(`registered_${eventId}`);
    if (registered === "true") {
      setHasRegistered(true);
    }

    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Event data:", data);
        console.log("Event image URL:", data.event?.image);
        setEvent(data.event);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) return <p className="text-white text-center mt-10 text-xl">Loading...</p>;
  if (!event) return <p className="text-red-500 text-center mt-10 text-xl">Event not found.</p>;

  return (
    <>
      {/* FIXED BACK BUTTON */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 bg-white text-black px-5 py-2 rounded-xl font-semibold shadow-lg border border-gray-300 hover:bg-gray-200 transition z-[99999]"
      >
        ← Back
      </button>

      <div className="min-h-screen bg-black flex justify-center items-start py-16 px-6">
        <div className="w-full max-w-6xl border-4 border-white p-10 rounded-2xl bg-black flex flex-col md:flex-row gap-10">
          
          {/* LEFT — IMAGE */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={event.image}
              alt={event.eventName}
              className="w-full max-h-[350px] rounded-3xl border-4 border-black object-cover"
            />
          </div>

          {/* RIGHT — DETAILS */}
          <div className="md:w-1/2 border-4 border-black p-6 rounded-2xl bg-white text-black">
            <h2 className="text-3xl font-bold mb-4">{event.eventName}</h2>

            <p className="mb-3"><strong>Description:</strong> {event.description}</p>
            <p className="mb-3"><strong>Price:</strong> ₹{event.price}</p>
            <p className="mb-3"><strong>Venue:</strong> {event.venue}</p>
            <p className="mb-3"><strong>Contact:</strong> {event.contact}</p>
            <p className="mb-3">
              <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p className="mb-3"><strong>Time:</strong> {event.eventTime}</p>
            <p className="mb-3">
              <strong>Last Date:</strong> {new Date(event.lastDate).toLocaleDateString()}
            </p>
            <p className="mb-3">
              <strong>Capacity:</strong> {event.capacity}
            </p>
            <p className="mb-3">
              <strong>Registered:</strong> {event.registeredCount}
            </p>

            {hasRegistered ? (
              <div className="w-full mt-6 bg-gray-300 text-gray-600 py-3 rounded-xl font-bold text-lg text-center">
                Already Registered ✓
              </div>
            ) : event.registeredCount >= event.capacity ? (
              <div className="w-full mt-6 bg-red-500 text-white py-3 rounded-xl font-bold text-lg text-center">
                Event Full - Registration Closed
              </div>
            ) : (
              <button
                onClick={() => onRegister(eventId)}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}