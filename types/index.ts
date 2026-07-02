import { Timestamp } from 'firebase-admin/firestore';
import { DocumentReference } from 'firebase-admin/firestore';

export interface User {
    user_id: string;
    name: string;
    email: string;
    password?:string;
    department: string;
    contact_number: string;
    role: "Student" | "Campus Staff" | "Resource Manager" | "Admin";
    account_status: "Active" | "Blocked";
    two_factor_enabled: boolean;
}

export interface Resource {
    resource_id: string;
    resource_name: string;
    resource_dept: string;
    resource_img_url?: string | null;
    resource_equipments?: string[] | null;
    resource_status: "Available" | "Booked" | "Under Maintenance";
}

export interface Booking {
    booking_id: string;
    booking_owner: User;
    booking_start: Date;
    booking_end: Date;
    booking_status: "Booked" | "Check-in" | "Ended" | "Cancelled" | "Awaiting Approval" | "Rejected" | "Pending Re-approval";
    booking_reason: string;
    resource: Resource;
    request_created_at: Date;
    prev_booking?: string | null;
}

export interface MaintenanceRequest{
    fault_id: string;
    fault_title: string;
    request_author: string;
    request_author_email: string;
    faulty_resource_ref: string,
    faulty_resource_name: string;
    faulty_resource_dept: string;
    fault_detail: string;
    proof_url: string;
    status: "Pending" | "Scheduled" | "Complete";
    request_date: Date;
    scheduledServiceDate: Date | null;
}

export interface Notification {
    notification_id: string;
    type: "report" | "booking" | "general";
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    targetUser: string;
}

export interface AnalyticsData {
    bookingCount: number,
    bookingTopResources: {
        resourceId: string;
        name: string;
        count: number;
    }[],
    peakBookingHours: number,
    reportCount: number,
    reportTopResources: {
        resourceId: string;
        name: string;
        count: number;
    }[]
}