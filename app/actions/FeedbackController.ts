"use server";
import { google } from "googleapis";

export async function fetchFeedbacks() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
            range: "Form Responses 1!A:F",
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) return [];

        const [, ...data] = rows;
        return data.map((row, i) => ({
            id: i + 1,
            timestamp: row[0] || "",
            name: row[1] || "",
            studentId: row[2] || "",
            rating: row[3] || "",
            feature: row[4] || "",
            comments: row[5] || "",
        }));
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
}