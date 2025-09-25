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
  async updateMember(id: number, updatedData: CreateMemberRequest): Promise<Member> {
    if (!id || id <= 0) {
      throw new Error("Invalid member ID");
    } else if (
      !updatedData.Fname ||
      !updatedData.Sname ||
      !updatedData.email ||
      !updatedData.phone ||
      !updatedData.address ||
      !updatedData.city ||
      !updatedData.postcode
    ) {
      throw new Error(
        "All fields are required: Fname, Sname, email, phone, address, city, postcode"
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
      throw new Error("Invalid email format");
    }

    // Check if member exists before updating
    const existingMember = await this.memberRepository.findById(id);
    if (!existingMember) {
      throw new Error("Member not found");
    }

    // Check if email is being changed to one that already exists
    if (updatedData.email !== existingMember.email) {
      const memberWithSameEmail = await this.memberRepository.findByEmail(updatedData.email);
      if (memberWithSameEmail && memberWithSameEmail.id !== id) {
        throw new Error("A member with this email already exists");
      }
    }

    // Update the member and return the updated record directly
    const updatedMember = await this.memberRepository.updateMember(id, updatedData);
    return updatedMember;
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
}
