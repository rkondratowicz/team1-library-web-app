import type { Copy } from "./Copy.js";

export interface Book {
  ISBN: string;
  Title: string;
  Author: string;
  PublicationYear: number;
  Description: string;
  available?: number;
  genres?: string[];
  totalCopies?: number; // Support for multiple copies
  availableCopies?: number; // Support for multiple copies
  copies?: Copy[]; // Array of individual copies
}

export interface BookCopy {
  copyId: string;
  isbn: string;
  status: "available" | "borrowed" | "maintenance" | "lost";
  acquisitionDate?: string;
  condition?: "new" | "good" | "fair" | "poor";
  location?: string; // Shelf location
}

export interface CopyTimeline {
  copyId: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  eventId: string;
  eventType: "acquired" | "borrowed" | "returned" | "maintenance" | "lost";
  date: string;
  memberInfo?: {
    id: number;
    name: string;
    email: string;
  };
  notes?: string;
}
