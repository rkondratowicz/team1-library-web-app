export interface Rental {
  rentalID?: number;
  memberID: number;
  bookISBN: string;
  returned: number; // 0 = not returned, 1 = returned
  RentalDate: string;
  returnedDate?: string;
}

export interface CreateRentalRequest {
  memberID: number;
  bookISBN: string;
}

export interface ActiveRentalInfo {
  rentalID: number;
  bookISBN: string;
  bookTitle: string;
  bookAuthor: string;
  RentalDate: string;
}
