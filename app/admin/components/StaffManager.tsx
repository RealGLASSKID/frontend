
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Search, Pencil, Trash2, Check, X, Phone, Mail, AlertCircle } from "lucide-react";
import EmptyState from "./EmptyState";
import type { StaffMember } from "./types";
import {
  subscribeToStaff,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "@/lib/services/staff";

interface StaffFormValues {
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
}

const EMPTY_FORM_VALUES: StaffFormValues = {
  name: "",
  department: "",
  position: "",
  phone: "",
  email: "",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
  return initials.join("") || "?";
}

export default function StaffManager() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<StaffFormValues>(EMPTY_FORM_VALUES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<StaffFormValues>(EMPTY_FORM_VALUES);

  useEffect(() => {
    const unsubscribe = subscribeToStaff(
      (members) => {
        setStaffList(members);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load staff: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredStaff = useMemo<StaffMember[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return staffList;
    }

    return staffList.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query)
    );
  }, [staffList, searchQuery]);

  const handleAddStaff = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!formValues.name.trim()) {
      return;
    }

    try {
      await addStaffMember({
        name: formValues.name.trim(),
        department: formValues.department.trim() || "General",
        position: formValues.position.trim() || "Staff",
        phone: formValues.phone.trim() || "—",
        email: formValues.email.trim() || "—",
      });
      setFormValues(EMPTY_FORM_VALUES);
      setIsAddFormOpen(false);
    } catch (error) {
      setErrorMessage(`Couldn't save staff profile: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteStaffMember(id);
    } catch (error) {
      setErrorMessage(`Couldn't delete staff profile: ${(error as Error).message}`);
    }
  };

  const startEditing = (member: StaffMember): void => {
    setEditingId(member.id);
    setEditValues({
      name: member.name,
      department: member.department,
      position: member.position,
      phone: member.phone,
      email: member.email,
    });
  };

  const cancelEditing = (): void => {
    setEditingId(null);
    setEditValues(EMPTY_FORM_VALUES);
  };

  const saveEditing = async (id: string): Promise<void> => {
    if (!editValues.name.trim()) {
      return;
    }

    try {
      await updateStaffMember(id, {
        name: editValues.name.trim(),
        department: editValues.department.trim() || "General",
        position: editValues.position.trim() || "Staff",
        phone: editValues.phone.trim() || "—",
        email: editValues.email.trim() || "—",
      });
      setEditingId(null);
    } catch (error) {
      setErrorMessage(`Couldn't save changes: ${(error as Error).message}`);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary">Staff profiles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the team and leadership shown on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddFormOpen((previous) => !previous)}
          className="btn-primary flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add staff
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isAddFormOpen ? (
        <form
          onSubmit={handleAddStaff}
          className="mt-6 rounded-3xl bg-card p-6 shadow-soft"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="staff-name"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Name
              </label>
              <input
                id="staff-name"
                type="text"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, name: event.target.value }))
                }
                placeholder="e.g. Margaret Ellison"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="staff-department"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Department
              </label>
              <input
                id="staff-department"
                type="text"
                value={formValues.department}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    department: event.target.value,
                  }))
                }
                placeholder="e.g. Science"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="staff-position"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Position
              </label>
              <input
                id="staff-position"
                type="text"
                value={formValues.position}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    position: event.target.value,
                  }))
                }
                placeholder="e.g. Head of Department"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="staff-phone"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Phone
              </label>
              <input
                id="staff-phone"
                type="tel"
                value={formValues.phone}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, phone: event.target.value }))
                }
                placeholder="e.g. +234 800 000 0000"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="staff-email"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Email
              </label>
              <input
                id="staff-email"
                type="email"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, email: event.target.value }))
                }
                placeholder="e.g. m.ellison@cns.edu"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Save staff
            </button>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="btn-ghost rounded-full border border-border/40 px-5 py-2.5 text-sm font-medium text-primary transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6">
        <div className="relative sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search staff"
            className="w-full rounded-full border border-border/40 bg-card py-2.5 pl-11 pr-4 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-soft">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredStaff.length === 0 ? (
          <EmptyState
            title="No staff added yet."
            description="Add a profile to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Photo</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Position</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => {
                  const isEditing = editingId === member.id;

                  return (
                    <tr
                      key={member.id}
                      className="border-b border-border/40 transition-all duration-300 last:border-b-0 hover:bg-accent/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                          {getInitials(member.name)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-primary">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.name}
                            onChange={(event) =>
                              setEditValues((previous) => ({
                                ...previous,
                                name: event.target.value,
                              }))
                            }
                            className="w-full rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          <span className="font-medium">{member.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.department}
                            onChange={(event) =>
                              setEditValues((previous) => ({
                                ...previous,
                                department: event.target.value,
                              }))
                            }
                            className="w-full rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          member.department
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.position}
                            onChange={(event) =>
                              setEditValues((previous) => ({
                                ...previous,
                                position: event.target.value,
                              }))
                            }
                            className="w-full rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          member.position
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editValues.phone}
                            onChange={(event) =>
                              setEditValues((previous) => ({
                                ...previous,
                                phone: event.target.value,
                              }))
                            }
                            className="w-full rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {member.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editValues.email}
                            onChange={(event) =>
                              setEditValues((previous) => ({
                                ...previous,
                                email: event.target.value,
                              }))
                            }
                            className="w-full rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {member.email}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEditing(member.id)}
                                aria-label="Save"
                                className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                aria-label="Cancel"
                                className="rounded-full p-2 text-muted-foreground transition-all duration-300 hover:bg-accent"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(member)}
                                aria-label="Edit"
                                className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(member.id)}
                                aria-label="Delete"
                                className="rounded-full p-2 text-destructive transition-all duration-300 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
