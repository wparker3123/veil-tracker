import * as SQLite from 'expo-sqlite';
import {SQLiteDatabase} from "expo-sqlite";

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
    console.log("Done Initializing database...");

    console.log("testing entry in database...");
    await addDateEntry(db, "2025-06-20", 4, "headache, nausea, cramps", "N/A")

    await getDateEntry(db)
}

export async function addDateEntry(db: SQLiteDatabase, date: string, flowLevel: number, symptoms: string, notes: string) {
    await db.runAsync(`INSERT OR REPLACE INTO tracker_entries (date, flowLevel, symptoms, notes) VALUES (?, ?, ?, ?)`, date, flowLevel, symptoms, notes);
}

export async function getDateEntry(db: SQLiteDatabase) {
    await db.getAllAsync(`SELECT * FROM tracker_entries WHERE date == ?`, "2025-06-19").then((x) => {
        console.log(x);
    })
}