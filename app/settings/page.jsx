import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Settings - AI HR System',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        {/* Profile Settings */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter email"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Application Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified when new candidates apply</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </section>

        {/* AI Screening Settings */}
        <section className="border rounded-lg p-6">
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
                <p className="text-sm text-muted-foreground">Automatically shortlist candidates based on AI analysis</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-destructive rounded-lg p-6">
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </section>
      </div>
    </div>
  )
} 