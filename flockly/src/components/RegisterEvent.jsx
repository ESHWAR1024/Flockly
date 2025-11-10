import React, { useState, useEffect } from "react";

export default function RegisterEvent({ eventId, onBack, onSuccess }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    transactionScreenshot: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, transactionScreenshot: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log("Submitting registration for event:", eventId);
      console.log("Form data:", formData);

      const response = await fetch(`http://localhost:5000/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventId,
          ...formData
        })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server is not responding correctly. Please make sure the backend server is running on port 5000.");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        // Save email to localStorage to track registration
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem(`registered_${eventId}`, "true");
        alert("Registration successful!");
        onSuccess();
      } else {
        alert(data.message || "Registration failed");
        setSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert(`Failed to submit registration: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-white text-center mt-10 text-xl">Loading...</p>;
  if (!event) return <p className="text-red-500 text-center mt-10 text-xl">Event not found.</p>;

  return (
    <>
      <button
        onClick={onBack}
        className="fixed top-6 left-6 bg-white text-black px-5 py-2 rounded-xl font-semibold shadow-lg border border-gray-300 hover:bg-gray-200 transition z-[99999]"
      >
        ← Back
      </button>

      <div className="min-h-screen bg-black flex justify-center items-start py-16 px-6">
        <div className="w-full max-w-2xl border-4 border-white p-10 rounded-2xl bg-black">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Register for {event.eventName}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-4 border-white p-6 rounded-2xl bg-white">
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Transaction Screenshot *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:font-semibold hover:file:bg-gray-800"
                />
                {formData.transactionScreenshot && (
                  <div className="mt-3">
                    <img
                      src={formData.transactionScreenshot}
                      alt="Transaction preview"
                      className="max-h-40 rounded-lg border-2 border-black"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
