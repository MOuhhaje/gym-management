import { useCreateMemberMutation, useUpdateMemberMutation } from "./members.api";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Member, NewMember } from "./members.types";
import { toast } from "sonner";
import { LoaderCircle, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emptyMember: NewMember = {
  name: "",
  email: "",
  phone: "",
  status: "active",
};

const fieldHoverClass = "hover:border-primary/40";

type CreateMemberProps = {
  refetch: () => void;
  isEditing: boolean;
  member: Member | null;
  onCancelEdit: () => void;
};

export default function CreateMember({
  refetch,
  isEditing,
  member,
  onCancelEdit,
}: CreateMemberProps) {
  const [createMember, createState] = useCreateMemberMutation();
  const [updateMember, updateState] = useUpdateMemberMutation();
  const [formData, setFormData] = useState<NewMember>(
    member
      ? {
          name: member.name,
          email: member.email,
          phone: member.phone,
          status: member.status,
        }
      : emptyMember,
  );

  const isLoading = createState.isLoading || updateState.isLoading;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (value: NewMember["status"]) => {
    setFormData((current) => ({ ...current, status: value }));
  };

  const handleReset = () => {
    setFormData(emptyMember);
    onCancelEdit();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && member) {
        await updateMember({ id: member.id, data: formData }).unwrap();
        toast.success("Member updated successfully!");
      } else {
        await createMember(formData).unwrap();
        toast.success("Member created successfully!");
        setFormData(emptyMember);
      }
      refetch();
    } catch (err) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} member`, {
        description: JSON.stringify(err),
      });
    }
  };

  return (
    <Card
      className={`transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5 ${
        isEditing ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid size-10 place-items-center rounded-lg transition-all duration-300 ease-out group-hover/card:rotate-6 group-hover/card:scale-110 group-hover/card:shadow-md ${
                isEditing
                  ? "bg-amber-500/15 text-amber-600"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isEditing ? (
                <Pencil className="size-5 transition-transform duration-300 group-hover/card:scale-110" />
              ) : (
                <Plus className="size-5 transition-transform duration-300 group-hover/card:scale-110" />
              )}
            </div>
            <div>
              <CardTitle className="transition-colors duration-300 group-hover/card:text-primary">
                {isEditing ? "Edit Member" : "Add New Member"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? `Updating ${member?.name ?? "member"}'s details`
                  : "Fill in the details to register a new member."}
              </CardDescription>
            </div>
          </div>
          {isEditing && (
            <Badge variant="outline" className="transition-colors duration-300 hover:bg-secondary">
              Editing mode
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-name">Full name</Label>
              <Input
                id="member-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Benali"
                className={fieldHoverClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-email">Email address</Label>
              <Input
                id="member-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah@example.com"
                className={fieldHoverClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-phone">Phone number</Label>
              <Input
                id="member-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06xxxxxxxx"
                className={fieldHoverClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="member-status" className={`w-full ${fieldHoverClass}`}>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="submit"
              disabled={isLoading}
              className="hover:-translate-y-px hover:shadow-md hover:shadow-primary/20"
            >
              {isEditing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
              {isEditing ? "Update Member" : "Create Member"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="hover:shadow-sm"
            >
              {isEditing ? "Cancel" : "Reset"}
            </Button>
            {isLoading && (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Submitting...
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
