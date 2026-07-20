"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Upload, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import type { SchoolSettings } from "./types";
import {
  subscribeToSettings,
  updateSchoolSettings,
  uploadSchoolLogo,
} from "@/lib/services/settings";

const EMPTY_SETTINGS: SchoolSettings = {
  schoolName: "",
  principalName: "",
  phone: "",
  email: "",
  address: "",
  logoUrl: "",
};

export default function SettingsManager() {
  const [settings, setSettings] = useState<SchoolSettings>(EMPTY_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSavedMessage, setShowSavedMessage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(
      (settingsData) => {
        setSettings(settingsData);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load settings: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingLogo(true);
    try {
      await uploadSchoolLogo(file);
    } catch (error) {
      setErrorMessage(`Couldn't upload logo: ${(error as Error).message}`);
    } finally {
      setIsUploadingLogo(false);
      event.target.value = "";
    }
  };

  const handleFieldChange = (
    field: keyof Omit<SchoolSettings, "logoUrl">,
    value: string
  ): void => {
    setSettings((previous) => ({ ...previous, [field]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateSchoolSettings({
        schoolName: settings.schoolName,
        principalName: settings.principalName,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
      });
      setShowSavedMessage(true);
      window.setTimeout(() => setShowSavedMessage(false), 2500);
    } catch (error) {
      setErrorMessage(`Couldn't save changes: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div>
        <h2 className="font-display text-2xl text-primary">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the school profile shown across the public site.
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center rounded-3xl bg-card py-16 shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-6 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
          <div>
            <p className="text-sm font-medium text-primary">School logo</p>
            <div className="mt-3 flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                {isUploadingLogo ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : settings.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.logoUrl}
                    alt="School logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="btn-ghost flex items-center gap-2 rounded-full border border-border/40 px-5 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Upload className="h-4 w-4" />
                  Upload logo
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  PNG or JPG, square image recommended.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-school-name"
                className="mb-2 block text-sm font-medium text-primary"
              >
                School name
              </label>
              <input
                id="settings-school-name"
                type="text"
                value={settings.schoolName}
                onChange={(event) => handleFieldChange("schoolName", event.target.value)}
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="settings-principal-name"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Principal name
              </label>
              <input
                id="settings-principal-name"
                type="text"
                value={settings.principalName}
                onChange={(event) => handleFieldChange("principalName", event.target.value)}
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="settings-phone"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Phone
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={settings.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={settings.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="settings-address"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Address
              </label>
              <input
                id="settings-address"
                type="text"
                value={settings.address}
                onChange={(event) => handleFieldChange("address", event.target.value)}
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>

            {showSavedMessage ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Changes saved
              </span>
            ) : null}
          </div>
        </form>
      )}
    </section>
  );
}