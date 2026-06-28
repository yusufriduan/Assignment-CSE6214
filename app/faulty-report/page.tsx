"use client";

import { useEffect, useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";
import { use } from "react";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import { fetchResource } from "@/app/actions/ResourceController";
import { createRequest } from "@/app/actions/MaintenanceController";
import { useRouter } from "next/navigation";

interface FaultReportForm {
  reportTitle: string;
  location: string;
  description: string;
}

interface ResourceDetails {
  id: string;
  name: string;
  dept: string;
  img: string | null;
  status: string;
  equipments: { equipment_name: string; equipment_count: number }[];
}

interface FaultReportPageProps {
  params: Promise<{ id: string }>;
}

export default function FaultReportPage({ params }: FaultReportPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [form, setForm] = useState<FaultReportForm>({
    reportTitle: "",
    location: "",
    description: "",
  });
  const [resource, setResource] = useState<ResourceDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadResource() {
      try {
        const item = await fetchResource(id);
        if (!isMounted) return;
        if (!item) {
          setError("Resource not found.");
          return;
        }
        setResource(item);
      } catch (fetchError) {
        console.error(fetchError);
        if (isMounted) setError("Unable to load resource details.");
      }
    }

    loadResource();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (field: keyof FaultReportForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: any) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: any) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to submit a fault report.");
      return;
    }

    if (!form.reportTitle.trim() || !form.location.trim() || !form.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!resource) {
      alert("Resource details are unavailable.");
      return;
    }

    setIsSubmitting(true);
    const response = await createRequest({
      fault_title: form.reportTitle,
      request_author_id: user.user_id,
      request_author_email: user.email,
      faulty_resource_ref: `Resources/${resource.id}`,
      fault_detail: form.description,
      proof_url: images[0] || "",
      status: "Pending",
      request_date: new Date(),
      scheduledServiceDate: null,
    });

    setIsSubmitting(false);

    if (response?.success) {
      router.push("/view_reports");
    } else {
      alert(response?.message || "Unable to submit the fault report.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Report a Fault</h1>
        <p className="mt-2 text-sm text-gray-600">Submit a maintenance report for the selected equipment.</p>
      </div>

      <form className="p-6 space-y-5 flex-1" onSubmit={handleSubmit}>
        <div className="rounded-3xl bg-gray-100 p-4">
          <p className="text-base font-semibold text-black mb-3">Resource</p>
          {resource ? (
            <div className="space-y-2">
              <p className="text-base font-bold text-black">{resource.name}</p>
              <p className="text-sm text-gray-600">Department: {resource.dept}</p>
              <p className="text-sm text-gray-600">Status: {resource.status}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Loading resource details...</p>
          )}
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Report Title</label>
          <input
            type="text"
            value={form.reportTitle}
            onChange={(e) => handleChange("reportTitle", e.target.value)}
            placeholder="Equipment name or issue"
            className="w-full bg-gray-200 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Venue</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Room or location"
            className="w-full bg-gray-200 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

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

          {images.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((image, idx) => (
                <img key={idx} src={image} alt={`Uploaded ${idx}`} className="rounded-2xl w-20 h-20 object-cover flex-shrink-0" />
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-full transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>

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
