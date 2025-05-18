import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="Enter email"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive email updates about new applications</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Application Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified when candidates apply</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AI Screening Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Match Percentage</label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Shortlist</h3>
                <p className="text-sm text-muted-foreground">Automatically shortlist candidates above threshold</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-destructive rounded-lg p-6">
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 