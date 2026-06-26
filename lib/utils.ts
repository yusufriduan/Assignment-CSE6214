export function cleanFirestoreData(data: any): any {
    if (!data) return null;
    if (typeof data.toDate === 'function') return data.toDate(); // Convert Timestamps
    if (Array.isArray(data)) return data.map(cleanFirestoreData); // Handle Arrays
    if (typeof data === 'object' && !(data instanceof Date)) { // Handle Objects
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, cleanFirestoreData(value)])
        );
    }
    return data;
}