export interface Rental {
  rentalID?: number;
  memberID: number;
  copyID: number;
  returned: number; // 0 = not returned, 1 = returned
  RentalDate: string;
  returnedDate?: string;
}

export interface CreateRentalRequest {
  memberID: number;
  copyID: number;
}

export interface ActiveRentalInfo {
  rentalID: number;
  copyID: number;
  bookISBN: string;
  bookTitle: string;
  bookAuthor: string;
  RentalDate: string;
}
