import { useEffect, useMemo, useState } from "react";
import CreateMember from "./CreateMember";
import { useGetMembersQuery, useDeleteMemberMutation } from "./members.api";
import type { Member } from "./members.types";
import { toast } from "sonner";
import { LoaderCircle, Pencil, Search, Trash2, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MembersList() {
  useEffect(() => {
    document.title = "Gym Members";
  }, []);

  const { data: members, isLoading, isError, error, refetch } = useGetMembersQuery();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();
  // refetching data every time the component is mounted
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  // Changing the key remounts the form so it starts from the selected member.
  const [formKey, setFormKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Member["status"]>("all");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (members ?? []).filter((member) => {
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      const matchesQuery =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [members, search, statusFilter]);

  const isFiltered = search.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setFormKey((key) => key + 1);
  };

  const handleCancelEdit = () => {
    setSelectedMember(null);
    setFormKey((key) => key + 1);
  };

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      return;
    }
    try {
      await deleteMember(member.id).unwrap();
      // Don't leave the form editing a member that no longer exists.
      if (selectedMember?.id === member.id) {
        handleCancelEdit();
      }
      refetch(); // Refetch the members list after deletion
      toast.success(`${member.name} was deleted.`);
    } catch (err) {
      toast.error(`Failed to delete ${member.name}`, {
        description: JSON.stringify(err),
      });
    }
  };

  return (
    <div className="space-y-6">
      <CreateMember
        key={formKey}
        refetch={refetch}
        isEditing={selectedMember !== null}
        member={selectedMember}
        onCancelEdit={handleCancelEdit}
      />

      <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 ease-out group-hover/card:rotate-6 group-hover/card:scale-110 group-hover/card:shadow-md">
                <Users className="size-5 transition-transform duration-300 group-hover/card:scale-110" />
              </div>
              <div>
                <CardTitle className="transition-colors duration-300 group-hover/card:text-primary">
                  Members
                </CardTitle>
                <CardDescription>Manage your gym roster</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="transition-colors duration-300 hover:bg-secondary/70">
              {isFiltered
                ? `${filteredMembers.length} of ${members?.length ?? 0}`
                : `${members?.length ?? 0} total`}
            </Badge>
          </div>
        </CardHeader>

        <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone..."
              aria-label="Search members"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Status</span>
            <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
              {(["all", "active", "inactive"] as const).map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={statusFilter === value ? "default" : "ghost"}
                  onClick={() => setStatusFilter(value)}
                  className="h-7 capitalize"
                >
                  {value}
                </Button>
              ))}
            </div>
            {isFiltered && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-1"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <CardContent className="px-0">
          {isError && (
            <Alert variant="destructive" className="mx-4 mb-4">
              <AlertTitle>Could not load members</AlertTitle>
              <AlertDescription>{JSON.stringify(error)}</AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <LoaderCircle className="size-6 animate-spin text-primary" />
                      <p className="text-sm">Loading members...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : members?.length ? (
                filteredMembers.length ? (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className={`group/row transition-colors duration-200 hover:bg-primary/5 ${
                        selectedMember?.id === member.id ? "bg-muted/60" : ""
                      }`}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-0 transition-all duration-300 group-hover/row:scale-110 group-hover/row:ring-2 group-hover/row:ring-primary/20">
                            {initials(member.name)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground transition-colors duration-200 group-hover/row:text-primary">
                              {member.name}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              #{member.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`transition-colors duration-300 ${
                            member.status === "active"
                              ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                              : "hover:bg-secondary/80"
                          }`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          <span className="capitalize">{member.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(member)}
                            title={`Edit ${member.name}`}
                            className="transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary active:scale-95"
                          >
                            <Pencil className="size-4 transition-transform duration-200 group-hover/row:rotate-12" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(member)}
                            disabled={isDeleting}
                            title={`Delete ${member.name}`}
                            className="text-destructive transition-all duration-200 hover:scale-110 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                          >
                            <Trash2 className="size-4 transition-transform duration-200 group-hover/row:rotate-12" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                          <Search className="size-6" />
                        </div>
                        <p className="font-medium text-foreground">
                          No matching members
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try a different search or status.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : !isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                        <Users className="size-6" />
                      </div>
                      <p className="font-medium text-foreground">No members yet</p>
                      <p className="text-sm text-muted-foreground">
                        Add your first member using the form above.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
