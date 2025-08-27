"use client";

import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
}
