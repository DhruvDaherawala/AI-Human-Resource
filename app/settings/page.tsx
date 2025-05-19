import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Settings - AI HR System",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        {/* Profile Settings */}
        <div className="border rounded-lg p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your email"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border rounded-lg p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Application Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified when new candidates apply</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            </div>
          </div>
        </div>

        {/* AI Screening Settings */}
        <div className="border rounded-lg p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">AI Screening Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Minimum Match Percentage</label>
              <input
                type="range"
                min="0"
                max="100"
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Auto-Shortlist</h3>
                <p className="text-sm text-muted-foreground">Automatically shortlist candidates above threshold</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border rounded-lg p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 