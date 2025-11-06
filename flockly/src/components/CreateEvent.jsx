import React, { useState } from "react";

// ✅ Simple Tailwind-only Card and Button Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-300 shadow-xl bg-black text-white ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none ${className}`}
  >
    {children}
  </button>
);

export default function CreateEvent({ onCancel }) 
 {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    image: "",
    price: "",
    lastDate: "",
    eventDate: "",
    eventTime: "",
    capacity: "",
    venue: "",
    contact: "",
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newField, setNewField] = useState({ name: "", type: "text" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleAddCustomField = () => {
    setShowPopup(true);
  };

  const handleCreateCustomField = () => {
    if (newField.name.trim()) {
      setCustomFields([...customFields, newField]);
      setFormData({ ...formData, [newField.name]: "" });
      setNewField({ name: "", type: "text" });
      setShowPopup(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    alert("Event Created Successfully!");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-12 px-4 relative">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">
        CREATE YOUR EVENT HERE
      </h1>

      <Card className="w-full max-w-6xl">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* LEFT: Image upload, Venue, Contact */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <label className="block text-lg font-semibold mb-4">
                Upload Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full mb-4 text-black bg-white p-2 rounded-lg"
              />
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Event Preview"
                  className="rounded-xl shadow-lg w-full h-auto object-cover border-2 border-white mb-6"
                />
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-400 text-gray-300 mb-6">
                  No Image Uploaded
                </div>
              )}

              {/* Venue Field */}
              <div className="w-full mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter event venue"
                  className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                  required
                />
              </div>

              {/* Contact Field */}
              <div className="w-full mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact info (email or phone)"
                  className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                  required
                />
              </div>

              {/* Add Custom Field Button */}
              <Button
                type="button"
                onClick={handleAddCustomField}
                className="w-full bg-white text-black font-bold hover:bg-gray-200"
              >
                + Add Custom Field
              </Button>
            </div>

            {/* RIGHT: Event form fields */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full md:w-1/2"
            >
              {/* Event Name */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description"
                  className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                  rows="4"
                  required
                />
              </div>

              {/* Price, Event Date, and Event Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Last Date & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Last Date
                  </label>
                  <input
                    type="date"
                    name="lastDate"
                    value={formData.lastDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Max attendees"
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Custom Fields Render */}
              {customFields.map((field, index) => (
                <div key={index}>
                  <label className="block text-lg font-semibold mb-2">
                    {field.name}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                    className="w-full p-3 rounded-lg bg-white text-black font-semibold focus:outline-none"
                  />
                </div>
              ))}

              {/* Buttons */}
              <Button
                type="submit"
                className="mt-6 w-full bg-white text-black font-bold hover:bg-gray-200"
              >
                Create Event
              </Button>

              <Button
  type="button"
  onClick={() => {
    if (window.confirm("Are you sure you want to cancel?")) {
      if (typeof onCancel === "function") {
        onCancel(); // 👈 go back to Manager Home page
      } else {
        window.history.back(); // fallback if used standalone
      }
    }
  }}
  className="mt-4 w-full bg-red-500 text-black font-bold hover:bg-red-600"
>
  Cancel
</Button>

            </form>
          </div>
        </CardContent>
      </Card>

      {/* Popup for custom field creation */}
      {showPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Custom Field</h2>
            <label className="block mb-2 font-semibold">Field Name</label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              placeholder="Enter field name"
              className="w-full p-2 mb-4 border rounded-lg"
            />

            <label className="block mb-2 font-semibold">Field Type</label>
            <select
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded-lg"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="email">Email</option>
            </select>

            <div className="flex justify-between">
              <Button
                onClick={handleCreateCustomField}
                className="bg-black text-white hover:bg-gray-800"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-black hover:bg-red-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
