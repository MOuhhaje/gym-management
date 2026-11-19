export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}
export type NewMember = Omit<Member, "id">;