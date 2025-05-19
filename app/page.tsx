import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Resume Screening System",
  description: "Automate your resume screening process with AI",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">AI-Powered Resume Screening</h1>
                <p className="max-w-[700px] text-sm text-muted-foreground md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
                  Upload resumes, set your criteria, and let our AI find the best candidates for your job openings.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Button asChild size="sm">
                    <Link href="/upload">Start Uploading Resumes</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">Upload Resumes</h3>
                  <p className="text-sm text-muted-foreground">
                    Batch upload multiple PDF resumes at once to save time.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">Define Criteria</h3>
                  <p className="text-sm text-muted-foreground">
                    Set custom requirements for each job position to find the perfect match.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">AI Shortlisting</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes resumes and ranks candidates based on your criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                    Eliminate Bias, Save Time
                  </h2>
                  <p className="max-w-[600px] text-sm text-muted-foreground md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
                    Our AI-powered system helps eliminate unconscious bias in the hiring process while saving you hours
                    of manual resume screening.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/learn-more"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=400&width=400"
                width="550"
                height="550"
                alt="HR Dashboard Preview"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:aspect-square"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 AI Resume Screening. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
