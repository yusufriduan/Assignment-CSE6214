"use client";

import { useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";

interface FaultReport {
  resourceId: string;
  location: string;
  description: string;
}

export default function FaultReportPage() {
  const [form, setForm] = useState<FaultReport>({
    resourceId: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (field: keyof FaultReport, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: any) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: any) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submitting:", form, "Images:", images);
    alert("Fault report submitted!");
    setForm({ resourceId: "", location: "", description: "" });
    setImages([]);
  };

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32">
      {/* Header */}
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Report a Fault</h1>
      </div>

      {/* Form Content */}
      <form className="p-6 space-y-5 flex-1" onSubmit={handleSubmit}>
        {/* Report Title */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Report Title</label>
          <input
            type="text"
            value={form.resourceId}
            onChange={(e) => handleChange("resourceId", e.target.value)}
            placeholder="Equipment name or issue"
            className="w-full bg-gray-300 rounded-full px-4 py-3 text-base font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Venue</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Room or location"
            className="w-full bg-gray-300 rounded-full px-4 py-3 text-base font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Report Description */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Report Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the fault in detail"
            className="w-full bg-gray-200 rounded-3xl px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={5}
            required
          />
        </div>

        {/* Proof of Faulty */}
        <div>
          <label className="block text-base font-bold text-black mb-3">Proof of faulty</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="block bg-gray-300 rounded-3xl aspect-video flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
          >
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">+ Add Images</p>
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">{images.length} image(s) selected</p>
              )}
            </div>
          </label>

          {/* Display uploaded images */}
          {images.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((image, idx) => (
                <img key={idx} src={image} alt={`Uploaded ${idx}`} className="rounded-2xl w-20 h-20 object-cover flex-shrink-0" />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-full transition"
          >
            Submit Report
          </button>
        </div>
      </form>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 drop-shadow-2xl">
        <div className="w-fit bg-gray-300 rounded-full px-6 py-3 flex justify-center gap-8">
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdHome size={24} />
            <span className="text-sm font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdCalendarMonth size={24} />
            <span className="text-sm font-medium">Booking</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdPerson size={24} />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
