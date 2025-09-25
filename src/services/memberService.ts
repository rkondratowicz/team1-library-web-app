import type { CreateMemberRequest, Member } from "../models/member.js";
import { MemberRepository } from "../repositories/memberRepository.js";

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
