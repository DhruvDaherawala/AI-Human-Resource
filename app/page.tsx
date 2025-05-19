import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Target, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "AI-Powered Human Resource System",
  description: "Automate your resume screening process with AI",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AI-Powered Human Resource System
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload resumes, set your criteria, and let our AI find the best candidates for your job openings.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white hover:text-gray-900 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  <Link href="/upload">
                    Start Uploading Resumes
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <Link href="/learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">Upload Resumes</h3>
                  <p className="text-muted-foreground">
                    Batch upload multiple PDF resumes at once to save time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">Define Criteria</h3>
                  <p className="text-muted-foreground">
                    Set custom requirements for each job position to find the perfect match.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">AI Shortlisting</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes resumes and ranks candidates based on your criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Eliminate Bias, Save Time
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg">
                    Our AI-powered system helps eliminate unconscious bias in the hiring process while saving you hours
                    of manual resume screening.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white hover:text-gray-900 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                <img
                  src="/dashboard-preview.png"
                  width="550"
                  height="550"
                  alt="HR Dashboard Preview"
                  className="rounded-lg object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
