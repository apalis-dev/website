import { Divider } from "@/components/layout/divider"
import { Navigation } from "@/components/layout/navigation"
import { Ergonomics } from "@/components/sections/ergonomics"
import { Features } from "@/components/sections/features"
import { FAQ } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { PricingSection } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonial"
import { AnimatedSection } from "@/components/atoms/animated-section"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="dark bg-[#09090B] text-zinc-400 w-full overflow-x-hidden min-h-screen relative pt-16 sm:pt-24">
        <AnimatedSection delay={0.1}>
          <Hero />
        </AnimatedSection>
        <Divider className="mb-10" />
        <AnimatedSection delay={0.2}>
          <Ergonomics />
        </AnimatedSection>
        <Divider className="my-10" />
        <AnimatedSection delay={0.2}>
          <Features />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <PricingSection />
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href='/pricing#detailed-comparison' className="mx-auto px-6 py-3 rounded-md border border-border text-foreground font-semibold hover:bg-muted transition-colors">
              View Paid Features
            </Link>
          </div>

        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <Testimonials />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <FAQ />
        </AnimatedSection>
        {/* 
        <TechLogos />
        <Complexity /> */}
        {/* <JSSurvey /> */}
        {/* <Features /> */}
        {/* <Examples /> */}
        {/* <Screenshots /> */}
        {/* <Tweets /> */}
        {/* <Catch /> */}
        {/* <FAQ />
        
        <CTA /> */}
      </main>
    </>
  )
}
