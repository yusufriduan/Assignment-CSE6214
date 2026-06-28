"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdArrowBack } from "react-icons/md";

interface FaultReport {
  resourceId: string;
  location: string;
  description: string;
}

export default function FaultReportPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [form, setForm] = useState<FaultReport>({
    resourceId: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting:", form, "Images:", images);
      alert("Fault report submitted!");
      setForm({ resourceId: "", location: "", description: "" });
      setImages([]);
      router.push("/dashboard?tab=profile");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard?tab=profile");
  };

  if (status === "loading") {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header with Centered Back Button */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-center relative">
          <button
            onClick={handleBack}
            className="absolute left-0 flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition"
          >
            <MdArrowBack size={22} />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Report a Fault</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="w-full max-w-lg mx-auto px-4 pt-6">
          {/* Description Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <p className="text-sm text-gray-600">
              Submit a fault report for campus resources. Our team will review and address the issue.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 pb-4" onSubmit={handleSubmit}>
            {/* Report Title */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Title <span className="text-red-500">*</span>
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
                Venue <span className="text-red-500">*</span>
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
                Report Description <span className="text-red-500">*</span>
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
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 rounded-xl text-sm transition ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}