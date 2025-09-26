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

export interface RentalWithCopyInfo {
  id: number;
  fname: string;
  Sname: string;
  email: string;
  ISBN: string;
  Title: string;
  Author: string;
  copyID: number;
  rentalID: number;
  RentalDate: string;
  copyAvailable: number;
}

export interface MemberRental {
  rentalID: number;
  memberID: number;
  copyID: number;
  returned: number;
  RentalDate: string;
  returnedDate?: string;
  Title: string;
  Author: string;
  ISBN: string;
}

export interface CopyAvailabilityRow {
  Available: number;
}

export interface CopyIDRow {
  copyID: number;
}

export interface RentalIDRow {
  rentalID: number;
}

export interface RentalWithCopyIDRow {
  rentalID: number;
  copyID: number;
}

export interface BookCopySummaryRow {
  bookISBN: string;
  Title: string;
  Author: string;
  PublicationYear?: number;
  Description?: string;
  totalCopies: number;
  availableCopies: number;
}
