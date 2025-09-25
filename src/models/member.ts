export interface Member {
  id?: number;
  Fname: string;
  Sname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  join_date?: string;
}

export interface CreateMemberRequest {
  Fname: string;
  Sname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}
