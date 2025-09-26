import type { CreateMemberRequest, Member } from "../models/member.js";
import { type MemberRentalData, MemberRepository } from "../repositories/memberRepository.js";

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async getAllMembers(): Promise<Member[]> {
    return await this.memberRepository.findAll();
  }

  async getMemberById(id: number): Promise<Member | undefined> {
    if (!id || id <= 0) {
      throw new Error("Invalid member ID");
    }
    return await this.memberRepository.findById(id);
  }

  async searchMembers(query: string): Promise<Member[]> {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query cannot be empty");
    }

    const trimmedQuery = query.trim();
    return await this.memberRepository.search(trimmedQuery);
  }

  async rentBook(
    memberID: number,
    bookISBN: string
  ): Promise<{ success: boolean; message: string }> {
    if (!memberID || memberID <= 0) {
      return { success: false, message: "Invalid member ID" };
    }
    if (!bookISBN || bookISBN.trim().length === 0) {
      return { success: false, message: "Invalid book ISBN" };
    }
    const member = await this.memberRepository.findById(memberID);
    if (!member) {
      return { success: false, message: "Member not found" };
    }

    // Check if member has reached the 3-book rental limit
    const currentRentals = await this.memberRepository.getMemberRentals(memberID);
    if (currentRentals.length >= 3) {
      return { success: false, message: "Member has reached the maximum rental limit of 3 books" };
    }

    try {
      await this.memberRepository.rentBook(memberID, bookISBN);
      return { success: true, message: "Book rented successfully" };
    } catch (err: unknown) {
      console.error("Error in rentBook service:", err);
      return { success: false, message: "Error renting book" };
    }
  }

  async getMemberRentals(memberID: number): Promise<MemberRentalData[]> {
    if (!memberID || memberID <= 0) {
      throw new Error("Invalid member ID");
    }
    return await this.memberRepository.getMemberRentals(memberID);
  }

  async returnBook(
    memberID: number,
    bookISBN: string
  ): Promise<{ success: boolean; message: string }> {
    if (!memberID || memberID <= 0) {
      return { success: false, message: "Invalid member ID" };
    }
    if (!bookISBN || bookISBN.trim().length === 0) {
      return { success: false, message: "Invalid book ISBN" };
    }

    const member = await this.memberRepository.findById(memberID);
    if (!member) {
      return { success: false, message: "Member not found" };
    }

    try {
      await this.memberRepository.returnBook(memberID, bookISBN);
      return { success: true, message: "Book returned successfully" };
    } catch (err: unknown) {
      console.error("Error in returnBook service:", err);
      return {
        success: false,
        message: err instanceof Error ? err.message : "Error returning book",
      };
    }
  }

  async createMember(memberData: CreateMemberRequest): Promise<Member> {
    // Validate required fields
    if (
      !memberData.Fname ||
      !memberData.Sname ||
      !memberData.email ||
      !memberData.phone ||
      !memberData.address ||
      !memberData.city ||
      !memberData.postcode
    ) {
      throw new Error(
        "All fields are required: Fname, Sname, email, phone, address, city, postcode"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    const existingMember = await this.memberRepository.findByEmail(memberData.email);
    if (existingMember) {
      throw new Error("A member with this email already exists");
    }

    // Create the member
    const memberId = await this.memberRepository.create(memberData);

    // Return the created member
    const createdMember = await this.memberRepository.findById(memberId);
    if (!createdMember) {
      throw new Error("Failed to retrieve created member");
    }

    return createdMember;
  }

  async updateMember(id: number, memberData: CreateMemberRequest): Promise<Member> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error("Invalid member ID");
    }

    // Check if member exists
    const existingMember = await this.memberRepository.findById(id);
    if (!existingMember) {
      throw new Error("Member not found");
    }

    // Validate required fields
    if (
      !memberData.Fname ||
      !memberData.Sname ||
      !memberData.email ||
      !memberData.phone ||
      !memberData.address ||
      !memberData.city ||
      !memberData.postcode
    ) {
      throw new Error(
        "All fields are required: Fname, Sname, email, phone, address, city, postcode"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists for a different member
    const memberWithEmail = await this.memberRepository.findByEmail(memberData.email);
    if (memberWithEmail && memberWithEmail.id !== id) {
      throw new Error("A member with this email already exists");
    }

    // Update the member
    await this.memberRepository.update(id, memberData);

    // Return the updated member
    const updatedMember = await this.memberRepository.findById(id);
    if (!updatedMember) {
      throw new Error("Failed to retrieve updated member");
    }

    return updatedMember;
  }

  async deleteMember(id: number): Promise<void> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error("Invalid member ID");
    }

    // Check if member exists
    const existingMember = await this.memberRepository.findById(id);
    if (!existingMember) {
      throw new Error("Member not found");
    }

    // Delete the member
    await this.memberRepository.delete(id);
  }
}
