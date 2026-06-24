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
    booking_author: string;
    booking_owner: string;
    booking_start: Date;
    booking_end: Date;
    booking_status: "Booked" | "Check-in" | "Ended" | "Cancelled" | "Awaiting Approval";
    booking_reason: string;
    resource: string;
    request_created_at: Date;
    prev_booking_id?: string | null;
}

export interface MaintenanceRequest {
    maintenance_id: string;
    request_author: string;
    faulty_resource: string;
    fault_detail: string;
    proof_url: string;
    request_status: "Awaiting Approval" | "Scheduled" | "Resolved";
    request_date: Date;
    schedule_service_date: Date;
}

export interface Notification {
    notification_id: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    targetUser: string;
}