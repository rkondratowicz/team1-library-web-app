export interface Book {
  ISBN: number;
  title: string;
  author: string;
  publicationYear: number;
  description: string;
  available?: number;
}
