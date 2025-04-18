import Link from "next/link"

export default function AboutPage() {
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors text-foreground"
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About PayKrypt</h1>
              <p className="text-muted-foreground text-lg">
                PayKrypt is a next-generation digital banking platform that combines secure financial
                services with innovative blockchain technology.
              </p>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                  <p className="mt-2 text-muted-foreground">
                    Our mission is to provide secure, transparent, and accessible financial services to everyone,
                    regardless of their background or location. We believe that financial freedom is a right, not a privilege.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Our Story</h2>
                  <p className="mt-2 text-muted-foreground">
                    Founded in 2023, PayKrypt was born from a simple idea: banking should be easy, secure, and
                    transparent. Our founders, with decades of experience in fintech and blockchain technology,
                    set out to create a platform that would revolutionize how people interact with their money.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Our Team</h2>
                  <p className="mt-2 text-muted-foreground">
                    We are a diverse team of engineers, designers, and financial experts united by our passion
                    for innovation and our commitment to building a better financial future for everyone.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Our Values</h2>
                  <ul className="mt-2 space-y-2 text-muted-foreground list-disc pl-5">
                    <li>Security: We prioritize the safety of your assets and data above all else.</li>
                    <li>Transparency: We believe in clear, honest communication and no hidden fees.</li>
                    <li>Innovation: We constantly explore new technologies to improve our services.</li>
                    <li>Accessibility: We design our platform to be usable by everyone, regardless of technical ability.</li>
                    <li>Community: We value our users and actively incorporate their feedback into our development.</li>
                  </ul>
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
