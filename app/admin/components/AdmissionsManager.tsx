"use client";

import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronDown,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import EmptyState from "./EmptyState";
import type { AdmissionApplication, AdmissionStatus } from "./types";
import {
  subscribeToAdmissions,
  submitAdmissionApplication,
  updateAdmissionStatus,
  deleteAdmissionApplication,
} from "@/lib/services/admission";

const STATUS_OPTIONS: AdmissionStatus[] = ["pending", "approved", "rejected"];

const STATUS_BADGE_STYLES: Record<AdmissionStatus, string> = {
  pending: "bg-secondary text-muted-foreground",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
};

interface ApplicationFormValues {
  applicantName: string;
  gradeAppliedFor: string;
  email: string;
  phone: string;
}

const EMPTY_FORM_VALUES: ApplicationFormValues = {
  applicantName: "",
  gradeAppliedFor: "",
  email: "",
  phone: "",
};

export default function AdmissionsManager() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ApplicationFormValues>(EMPTY_FORM_VALUES);

  useEffect(() => {
    const unsubscribe = subscribeToAdmissions(
      (applicationsData) => {
        setApplications(applicationsData);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load applications: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredApplications = useMemo<AdmissionApplication[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch = application.applicantName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || application.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleAddApplication = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!formValues.applicantName.trim() || !formValues.gradeAppliedFor.trim()) {
      return;
    }

    try {
      await submitAdmissionApplication({
        applicantName: formValues.applicantName.trim(),
        gradeAppliedFor: formValues.gradeAppliedFor.trim(),
        email: formValues.email.trim() || "—",
        phone: formValues.phone.trim() || "—",
      });
      setFormValues(EMPTY_FORM_VALUES);
      setIsAddFormOpen(false);
    } catch (error) {
      setErrorMessage(`Couldn't save application: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteAdmissionApplication(id);
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      setErrorMessage(`Couldn't delete application: ${(error as Error).message}`);
    }
  };

  const handleStatusChange = async (id: string, status: AdmissionStatus): Promise<void> => {
    try {
      await updateAdmissionStatus(id, status);
    } catch (error) {
      setErrorMessage(`Couldn't update status: ${(error as Error).message}`);
    }
  };

  const toggleExpanded = (id: string): void => {
    setExpandedId((previous) => (previous === id ? null : id));
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary">Admissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage applications submitted through the admissions form.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddFormOpen((previous) => !previous)}
          className="btn-primary flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add application
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
          onSubmit={handleAddApplication}
          className="mt-6 rounded-3xl bg-card p-6 shadow-soft"
        >
          <p className="text-sm text-muted-foreground">
            For applications received by phone or in person. The applicant's status starts as Pending.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="application-name"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Applicant name
              </label>
              <input
                id="application-name"
                type="text"
                value={formValues.applicantName}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    applicantName: event.target.value,
                  }))
                }
                placeholder="e.g. Amaka Eze"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="application-grade"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Grade applied for
              </label>
              <input
                id="application-grade"
                type="text"
                value={formValues.gradeAppliedFor}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    gradeAppliedFor: event.target.value,
                  }))
                }
                placeholder="e.g. Grade 3"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="application-email"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Email
              </label>
              <input
                id="application-email"
                type="email"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, email: event.target.value }))
                }
                placeholder="e.g. parent@example.com"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="application-phone"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Phone
              </label>
              <input
                id="application-phone"
                type="tel"
                value={formValues.phone}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, phone: event.target.value }))
                }
                placeholder="e.g. +234 800 000 0000"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Save application
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search applicants"
            className="w-full rounded-full border border-border/40 bg-card py-2.5 pl-11 pr-4 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as AdmissionStatus | "all")}
          className="rounded-full border border-border/40 bg-card px-4 py-2.5 text-sm capitalize text-primary outline-none transition-all duration-300 focus:border-primary sm:w-56"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-soft">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title="No applications found"
            description="Try adjusting your search or filter, or add an application."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Grade applied for</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  const isExpanded = expandedId === application.id;

                  return (
                    <Fragment key={application.id}>
                      <tr className="border-b border-border/40 transition-all duration-300 last:border-b-0 hover:bg-accent/40">
                        <td className="px-6 py-4 font-medium text-primary">
                          {application.applicantName}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {application.gradeAppliedFor}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_BADGE_STYLES[application.status]}`}
                          >
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {application.submittedDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleExpanded(application.id)}
                              aria-label="View details"
                              className="flex items-center gap-1 rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                            >
                              <Eye className="h-4 w-4" />
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {application.status !== "approved" ? (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(application.id, "approved")}
                                aria-label="Approve application"
                                className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            ) : null}
                            {application.status !== "rejected" ? (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(application.id, "rejected")}
                                aria-label="Reject application"
                                className="rounded-full p-2 text-destructive transition-all duration-300 hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => handleDelete(application.id)}
                              aria-label="Delete application"
                              className="rounded-full p-2 text-destructive transition-all duration-300 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr className="border-b border-border/40 bg-secondary/40 last:border-b-0">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {application.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {application.phone}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
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