export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-xl font-bold tracking-tighter">WENDEV</div>
        <div className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
        </div>
        <button className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
          Hire Me
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="section-padding flex flex-col items-center justify-center text-center">
          <div className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-6">
            Available for new opportunities
          </div>
          <h1 className="text-gradient mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            Building digital <br />
            experiences that matter.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            I&apos;m a Full-stack Developer passionate about high-quality code and beautiful user interfaces.
            Focused on creating impactful web applications with modern technologies.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="#projects" className="bg-foreground text-background h-12 flex items-center rounded-full px-8 text-sm font-semibold hover:opacity-90 transition-opacity">
              View Work
            </a>
            <a href="#contact" className="border border-border glass h-12 flex items-center rounded-full px-8 text-sm font-semibold hover:bg-muted transition-colors">
              Get in Touch
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section-padding bg-muted/30">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With a deep background in computer science and design, I bridge the gap between complex logic and intuitive user interfaces. I believe that every project deserves a unique approach and a commitment to excellence.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"].map((skill) => (
                  <span key={skill} className="glass rounded-lg px-4 py-2 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl glass border-8 border-background">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                [AI Generated Profile Image]
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section-padding">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selected Projects</h2>
              <p className="text-muted-foreground">A showcase of some of my most impactful work.</p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-muted/50 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground italic">
                  [Project {i} Preview]
                </div>
                <div className="p-6">
                  <div className="mb-2 text-xs font-bold text-accent uppercase tracking-wider">Concept</div>
                  <h3 className="mb-2 text-xl font-bold">Project Name {i}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    A brief description of the project and the technical challenges solved during implementation.
                  </p>
                  <a href="#" className="inline-flex items-center text-sm font-semibold hover:underline">
                    View Case Study
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-padding flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-bold mb-6">Let&apos;s work together</h2>
          <p className="max-w-md text-muted-foreground mb-10">
            Have a project in mind? Looking for a new team member? I&apos;d love to hear from you.
          </p>
          <a
            href="mailto:hello@wendev.com"
            className="text-gradient text-3xl font-bold underline decoration-accent/30 underline-offset-8 transition-all hover:decoration-accent"
          >
            hello@wendev.com
          </a>
          <div className="mt-12 flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-accent">Twitter</a>
            <a href="#" className="hover:text-accent">GitHub</a>
            <a href="#" className="hover:text-accent">LinkedIn</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>© 2026 Wendev Portfolio. Built with Next.js & Tailwind.</div>
        <div className="mt-4 md:mt-0 flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy Policy</a>
          <a href="#" className="hover:text-foreground">Terms of Use</a>
        </div>
      </footer>
    </div>
  );
}

