"use client";

import { useState } from "react";
import Button from "../components/Button";

interface FaultReportForm {
  resourceId: string;
  location: string;
  description: string;
  photo: File | null;
}

interface FaultReportItem {
  id: number;
  resourceId: string;
  location: string;
  description: string;
  status: string;
  createdAt: string;
}

const sampleReports: FaultReportItem[] = [
  {
    id: 1,
    resourceId: "CLC-204-PRJ",
    location: "CLC 204",
    description: "Projector lamp is flickering during presentations.",
    status: "Open",
    createdAt: "2026-06-20 11:30",
  },
  {
    id: 2,
    resourceId: "FCI-LAB-PC02",
    location: "FCI Lab",
    description: "Workstation computer is not powering on.",
    status: "Under review",
    createdAt: "2026-06-18 15:05",
  },
];

export default function FaultReportPage() {
  const [report, setReport] = useState<FaultReportForm>({
    resourceId: "",
    location: "",
    description: "",
    photo: null,
  });
  const [reports] = useState<FaultReportItem[]>(sampleReports);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FaultReportForm, value: string | File | null) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-10">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-slate-900">Report a Fault</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Submit a maintenance request for faulty equipment or room issues. The Resource Manager will be notified and can follow up on the issue.
            </p>
          </div>

          {submitted && (
            <div className="mb-6 rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              Your fault report has been recorded. A notification will be sent to the resource manager for review.
            </div>
          )}

          <form className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-semibold text-slate-900">Fault Details</h2>
                <p className="mt-2 text-sm text-slate-600">Enter the resource and fault details clearly so maintenance can act fast.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="resourceId" className="text-sm font-bold text-slate-900">Resource ID</label>
                <input
                  id="resourceId"
                  type="text"
                  placeholder="Example: CLC-204-PRJ"
                  value={report.resourceId}
                  onChange={(event) => handleChange("resourceId", event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="location" className="text-sm font-bold text-slate-900">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Example: CLC 204"
                  value={report.location}
                  onChange={(event) => handleChange("location", event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-bold text-slate-900">Issue Description</label>
                <textarea
                  id="description"
                  rows={5}
                  value={report.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Describe the issue and any steps you noticed before the fault appeared."
                  className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="photo" className="text-sm font-bold text-slate-900">Upload Photo (optional)</label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleChange("photo", event.target.files ? event.target.files[0] : null)}
                  className="text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:shadow-sm"
                />
                <p className="text-xs text-slate-500">Attach an image if available to help the maintenance team verify the issue faster.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Submission rules</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  <li>Only report faults for resources you are currently using or responsible for.</li>
                  <li>Provide a clear location and resource ID.</li>
                  <li>Keep descriptions accurate so the team can fix the issue faster.</li>
                </ul>
              </div>

              <Button type="submit" className="!w-fit !rounded-3xl !px-8 !py-3 !text-white" buttonText="Submit Fault Report" />
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Quick Reference</h2>
                <dl className="mt-4 space-y-4 text-sm text-slate-600">
                  <div>
                    <dt className="font-semibold text-slate-800">Actor</dt>
                    <dd>Student or Campus Staff</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800">Precondition</dt>
                    <dd>User is logged in and has identified a faulty resource.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800">Postcondition</dt>
                    <dd>Fault report is logged and resource manager is notified.</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Recent Fault Reports</h2>
                <div className="mt-4 space-y-4">
                  {reports.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.resourceId}</h3>
                          <p className="text-sm text-slate-600">{item.location}</p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                      <p className="mt-2 text-xs text-slate-500">Submitted: {item.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
}
