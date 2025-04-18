import Link from "next/link"
import { Check } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              P
            </div>
            <Link href="/">PayKrypt</Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm font-medium transition-colors text-foreground"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <Link href="/login">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-2">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Sign Up
              </button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">PayKrypt Features</h1>
                <p className="text-muted-foreground text-lg">
                  Discover how PayKrypt is revolutionizing digital banking with powerful features and innovative technology.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Secure Transactions</h3>
                  <p className="text-muted-foreground">
                    Industry-leading encryption and multi-factor authentication keep your finances protected at all times.
                  </p>
                </div>
                
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Blockchain Integration</h3>
                  <p className="text-muted-foreground">
                    Seamlessly connect with various blockchain networks for transparent and verifiable transactions.
                  </p>
                </div>
                
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Assistant</h3>
                  <p className="text-muted-foreground">
                    Our intelligent banking assistant helps manage your accounts, answer questions, and provide financial insights.
                  </p>
                </div>
                
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Global Payments</h3>
                  <p className="text-muted-foreground">
                    Send and receive money internationally with minimal fees and rapid processing times.
                  </p>
                </div>
                
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Smart Budgeting</h3>
                  <p className="text-muted-foreground">
                    Automatic categorization and analysis of your spending habits to help you save more efficiently.
                  </p>
                </div>
                
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Multi-Currency Support</h3>
                  <p className="text-muted-foreground">
                    Hold and manage multiple currencies in one place with competitive exchange rates.
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-muted p-6 text-center">
                <h2 className="text-2xl font-semibold">Ready to experience the future of banking?</h2>
                <p className="mt-2 text-muted-foreground">
                  Join thousands of satisfied customers who have made the switch to PayKrypt.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
                    Sign Up Now
                  </Link>
                  <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">P</div>
              PayKrypt
            </div>
            <p className="text-sm text-muted-foreground">Secure banking for the digital age.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
