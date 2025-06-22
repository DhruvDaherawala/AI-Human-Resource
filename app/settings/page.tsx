'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

const DEFAULT_TEMPLATE = `Hello {candidateName},\n\nYour interview is scheduled for {interviewDate} at {interviewTime}.\n\nBest regards,\n{companyName}`;

export default function SettingsPage() {
  const { user, loading, login } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    hrEmail: '',
    companyName: '',
    phoneNumber: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [emailTemplate, setEmailTemplate] = useState(DEFAULT_TEMPLATE)
  const [templateLoading, setTemplateLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        hrEmail: user.hrEmail || '',
        companyName: user.companyName || '',
        phoneNumber: user.phoneNumber || '',
      })
      // TODO: fetch template from backend
    }
  }, [user])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const toastId = toast.loading('Updating profile...')
    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile.')
      }

      const updatedUser = await response.json()
      login(updatedUser) // Update user in auth context and local storage

      toast.success('Profile updated successfully!', { id: toastId })
    } catch (error: any) {
      toast.error(error.message || 'An error occurred.', { id: toastId })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    const toastId = toast.loading('Changing password...')
    try {
      const response = await fetch(`/api/user/${user._id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to change password.')
      }
      
      toast.success('Password changed successfully!', { id: toastId })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error.message || 'An error occurred.', { id: toastId })
    }
  }

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setTemplateLoading(true)
    try {
      // TODO: Save template to backend
      toast.success('Email template saved!')
    } catch (err) {
      toast.error('Failed to save template')
    } finally {
      setTemplateLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <p>You must be logged in to view this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and company settings.</p>
      </div>
      {/* Company Info Display Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Current company details (read-only).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Company Name</Label>
              <div className="border rounded px-3 py-2 bg-muted">{formData.companyName || '-'}</div>
            </div>
            <div>
              <Label>HR Email</Label>
              <div className="border rounded px-3 py-2 bg-muted">{formData.hrEmail || '-'}</div>
            </div>
            <div>
              <Label>Phone Number</Label>
              <div className="border rounded px-3 py-2 bg-muted">{formData.phoneNumber || '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Company & Profile</CardTitle>
            <CardDescription>Update your personal and company details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleFormChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hrEmail">Email</Label>
                <Input id="hrEmail" name="hrEmail" type="email" value={formData.hrEmail} onChange={handleFormChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password for better security.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
              </div>
              <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Email Template Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Email Template</CardTitle>
          <CardDescription>
            Set the default email template for interview scheduling.<br />
            Available variables: <code>{'{candidateName}'}</code>, <code>{'{interviewDate}'}</code>, <code>{'{interviewTime}'}</code>, <code>{'{interviewType}'}</code>, <code>{'{notes}'}</code>, <code>{'{companyName}'}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveTemplate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Email Template</Label>
              <textarea
                id="emailTemplate"
                className="w-full min-h-[120px] border rounded p-2 font-mono"
                value={emailTemplate}
                onChange={e => setEmailTemplate(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={templateLoading}>{templateLoading ? 'Saving...' : 'Save Template'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 