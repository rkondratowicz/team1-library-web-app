export interface Book {
  ISBN: string;
  Title: string;
  Author: string;
  PublicationYear: number;
  Description: string;
  available?: number;
  genres?: string[];
}
