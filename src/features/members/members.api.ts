import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Member, NewMember } from "./members.types";

export const membersApi = createApi({
  reducerPath: 'membersApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  endpoints: (builder) => ({
    getMembers: builder.query<Member[], void>({
      query: () => 'members',
    }),
    createMember: builder.mutation<Member, NewMember>({
      query: (newMember) => ({
        url: "members",
        method: "POST",
        body: newMember,
      }),
    }),
    updateMember: builder.mutation<Member, { id: string; data: Partial<NewMember> }>({
      query: ({ id, data }) => ({
        url: `members/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `members/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { 
  useGetMembersQuery, 
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation
} = membersApi;