"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Timestamp, DocumentReference } from "firebase-admin/firestore";

export async function generateBookingAnalytics(){
    const today = new Date();
  
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const startTimestamp = Timestamp.fromDate(sevenDaysAgo);
    const endTimestamp = Timestamp.fromDate(today);

    try {
        // Fetch bookings
        const bookingRef = await adminDb.collection('Bookings').where('booking_start', '>=', startTimestamp).where('booking_start', '<=', endTimestamp).get();
        const records: any[] = [];
        bookingRef.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
        });
        
        // Track both ID and the actual Reference for fetching later
        const resourceCounts: Record<string, { count: number; ref: DocumentReference }> = {};

        // get top 3 bookings
        records.forEach(booking => {
            const resourceRef = booking.resource as DocumentReference | undefined; 
            if (resourceRef && resourceRef.id) {
                const id = resourceRef.id;
                if (!resourceCounts[id]) {
                    resourceCounts[id] = { count: 0, ref: resourceRef };
                }
                resourceCounts[id].count += 1;
            }
        });

        const top3Resources = Object.entries(resourceCounts)
            .map(([resourceId, item]) => ({ resourceId, count: item.count, ref: item.ref }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // get heatmap
        const hourlyHeatmap = Array(24).fill(0);

        records.forEach(booking => {
            if (!booking.booking_start) return;

            const startDate = booking.booking_start.toDate();
            const startHour = startDate.getHours();
            
            hourlyHeatmap[startHour] += 1;
        });

        // Find the peak hour
        const peakHour = hourlyHeatmap.indexOf(Math.max(...hourlyHeatmap));

        // get top 3 reported venues
        const reportRef = await adminDb.collection('MaintenanceRequest').where('request_date', '>=', startTimestamp).where('request_date', '<=', endTimestamp).get();
        const reports: any[] = [];
        reportRef.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() });
        });

        const reportCounts: Record<string, { count: number; ref: DocumentReference }> = {};

        reports.forEach(report => {
            const resourceRef = report.faulty_resource as DocumentReference | undefined; 
            if (resourceRef && resourceRef.id) {
                const id = resourceRef.id;
                if (!reportCounts[id]) {
                    reportCounts[id] = { count: 0, ref: resourceRef };
                }
                reportCounts[id].count += 1;
            }
        });

        const top3Reported = Object.entries(reportCounts)
            .map(([resourceId, item]) => ({ resourceId, count: item.count, ref: item.ref }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Map containing all unique DocumentReferences to resolve
        const uniqueRefsMap = new Map<string, DocumentReference>();
        
        top3Resources.forEach(r => uniqueRefsMap.set(r.resourceId, r.ref));
        top3Reported.forEach(r => uniqueRefsMap.set(r.resourceId, r.ref));

        const resourceNameMap = new Map<string, string>();

        // Fetch names in parallel using the references directly
        await Promise.all(
            Array.from(uniqueRefsMap.entries()).map(async ([resourceId, resourceRef]) => {
                try {
                    const doc = await resourceRef.get();
                    if (doc.exists) {
                        const resourceName = doc.data()?.resource_name || 'Unknown Resource';
                        resourceNameMap.set(resourceId, resourceName);
                    } else {
                        resourceNameMap.set(resourceId, 'Deleted Resource');
                    }
                } catch (error) {
                    console.error(`Failed to fetch name for resource ${resourceId}:`, error);
                    resourceNameMap.set(resourceId, 'Error Loading Name');
                }
            })
        );

        const top3ResourcesWithNames = top3Resources.map(item => ({
            resourceId: item.resourceId,
            name: resourceNameMap.get(item.resourceId) || 'Unknown Resource',
            count: item.count
        }));

        const top3ReportedWithNames = top3Reported.map(item => ({
            resourceId: item.resourceId,
            name: resourceNameMap.get(item.resourceId) || 'Unknown Resource',
            count: item.count
        }));
        
        return {
            bookingCount: records.length,
            bookingTopResources: top3ResourcesWithNames,
            peakBookingHours: peakHour,
            reportTopResources: top3ReportedWithNames
        };
    } catch (error) {
        console.error("Admin SDK query failed: ", error);
        return {
            bookingCount: 0,
            bookingTopResources: [],
            peakBookingHours: -1,
            reportTopResources: []
        };
    }
}