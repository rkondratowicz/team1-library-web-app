export interface Copy {
  copyID: number;
  bookISBN: string;
  Available: number; // 1 = available, 0 = not available
}

export interface CreateCopyRequest {
  bookISBN: string;
  Available?: number; // defaults to 1
}

export interface CopyWithBookDetails {
  copyID: number;
  bookISBN: string;
  Available: number;
  Title?: string;
  Author?: string;
  PublicationYear?: number;
  Description?: string;
}

export interface AvailableCopySummary {
  bookISBN: string;
  Title: string;
  Author: string;
  PublicationYear?: number;
  Description?: string;
  totalCopies: number;
  availableCopies: number;
  copies: Copy[];
}