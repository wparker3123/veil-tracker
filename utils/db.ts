import * as SQLite from 'expo-sqlite';
import {SQLiteDatabase} from "expo-sqlite";
export type TrackerEntry = {
    id: number;
    date: string;
    flowLevel: number;
    notes: string;
    symptoms: string;
};

export default async function initDB(db: SQLiteDatabase) {
    console.log("Initializing database...");
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tracker_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      flowLevel INTEGER,
      symptoms TEXT,
      notes TEXT
    );
  `);
}

export async function addDateEntry(db: SQLiteDatabase, date: string, flowLevel: number, symptoms: string, notes: string) {
    await db.runAsync(`INSERT OR REPLACE INTO tracker_entries (date, flowLevel, symptoms, notes) VALUES (?, ?, ?, ?)`, date, flowLevel, symptoms, notes);
}

export async function getVeilData(db: SQLiteDatabase) : Promise<TrackerEntry[]> {
    return await db.getAllAsync(
        `SELECT * FROM tracker_entries`
    );
}
export async function getDateEntry(db: SQLiteDatabase, date: string) : Promise<TrackerEntry | null> {
    return await db.getFirstAsync<TrackerEntry>(
        `SELECT * FROM tracker_entries WHERE date = ?;`,
        [date]
    );
}

export async function deleteDateEntry(db: SQLiteDatabase, date: string): Promise<void> {
    await db.runAsync(
        `DELETE FROM tracker_entries WHERE date = ?`,
        date
    );
}