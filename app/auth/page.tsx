'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Building, Users, Target, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  const { user, loading } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Features/Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">RecruAI</h1>
            <p className="text-xl text-muted-foreground">
              AI-Powered Human Resource Management System
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Resume Screening</h3>
                <p className="text-muted-foreground">
                  Upload resumes and let our AI find the best candidates for your job openings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Custom Criteria</h3>
                <p className="text-muted-foreground">
                  Set specific requirements for each position to find the perfect match.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Candidate Management</h3>
                <p className="text-muted-foreground">
                  Organize and track candidates through your hiring pipeline.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Get detailed analysis and recommendations for each candidate.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Join thousands of HR professionals who trust RecruAI to streamline their hiring process.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Authentication Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-primary mb-2">RecruAI</h1>
            <p className="text-muted-foreground">
              AI-Powered Human Resource Management
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 