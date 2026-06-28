"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar, { NavItem } from "@/app/components/NavBar"; // Using @ alias
import { LuHouse, LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";

interface FaultReport {
  resourceId: string;
  location: string;
  description: string;
}

export default function FaultReportPage() {
  const router = useRouter();
  const [form, setForm] = useState<FaultReport>({
    resourceId: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (field: keyof FaultReport, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: any) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", form, "Images:", images);
    alert("Fault report submitted!");
    setForm({ resourceId: "", location: "", description: "" });
    setImages([]);
  };

  const handleNavClick = (section: string) => {
    if (section === "home") {
      router.push("/dashboard");
    } else if (section === "booking") {
      router.push("/dashboard?tab=booking");
    } else if (section === "profile") {
      router.push("/dashboard?tab=profile");
    } else if (section === "history") {
      router.push("/student-faculty-history");
    }
  };

  const staffNav: NavItem[] = [
    { id: "home", label: "Home", icon: LuHouse },
    { id: "booking", label: "Booking", icon: LuCalendarPlus },
    { id: "history", label: "History", icon: LuUsers },
    { id: "profile", label: "Profile", icon: MdOutlinePerson },
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="w-full max-w-lg mx-auto px-4 pt-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Report a Fault</h1>
            <p className="mt-1 text-sm text-gray-600">Submit a fault report for campus resources.</p>
          </div>

          {/* Form */}
          <form className="mt-4 space-y-4 pb-4" onSubmit={handleSubmit}>
            {/* Report Title */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={form.resourceId}
                onChange={(e) => handleChange("resourceId", e.target.value)}
                placeholder="Equipment name or issue"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Venue */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Room or location"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Report Description */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the fault in detail"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={5}
                required
              />
            </div>

            {/* Proof of Faulty */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Proof of Faulty
              </label>

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
                className="block bg-gray-100 rounded-2xl aspect-video flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
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
                    <img
                      key={idx}
                      src={image}
                      alt={`Uploaded ${idx}`}
                      className="rounded-xl w-20 h-20 object-cover flex-shrink-0 border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm transition"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>

      {/* Fixed Bottom Navbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
        <NavBar
          items={staffNav}
          activeSection="home"
          onSectionChange={handleNavClick}
        />
      </div>
    </div>
  );
}