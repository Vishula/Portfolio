import { About, CallToAction, Education, Experience, Hero, Skills } from "@/components/sections/Sections";
import { SITE } from "@/lib/site";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.fullName,
  email: SITE.email,
  jobTitle: SITE.role,
  url: SITE.url,
  sameAs: [SITE.linkedin, SITE.github].filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <CallToAction />
    </>
  );
}
