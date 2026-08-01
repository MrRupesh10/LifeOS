import { Settings, User, Bookmark, Palette, Key } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";

const settingsSections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your display name, avatar, and account details.",
    action: "Edit Profile",
  },
  {
    icon: Bookmark,
    title: "Preferences",
    description: "Configure default views, notifications, and module layout.",
    action: "Configure",
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Choose theme, density, and accent color.",
    action: "Customize",
  },
  {
    icon: Key,
    title: "Security",
    description: "Manage password, sessions, and two-factor authentication.",
    action: "Review",
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader title="Settings" description="Manage your LifeOS preferences." />

      <Card variant="default">
        <div className="divide-border divide-y">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="flex items-center justify-between gap-4 py-5 first:pt-1 last:pb-1"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                  <section.icon className="text-muted-foreground size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium">{section.title}</p>
                  <p className="text-muted-foreground text-xs">{section.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {section.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
