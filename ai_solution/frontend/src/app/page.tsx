"use client";
import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ServicesPreview from "@/components/sections/ServicesPreview";
import BlogsPreview from "@/components/sections/BlogsPreview";
import GalleryPreview from "@/components/sections/GalleryPreview";
import FAQSection from "@/components/sections/FAQSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CTASection from "@/components/sections/CTASection";
import SolutionsPreview from "@/components/sections/SolutionsPreview";
import { useFetch } from "@/hooks/useFetch";
import { servicesAPI, blogsAPI, galleryAPI, solutionsAPI } from "@/lib/api";

export default function HomePage() {
  const { data: allServices, loading: loadingServices } = useFetch<any[]>(() =>
    servicesAPI.list(),
  );
  const { data: allSolutions, loading: loadingSolutions } = useFetch<any[]>(
    () => solutionsAPI.list(),
  );
  const { data: allBlogs, loading: loadingBlogs } = useFetch<any[]>(() =>
    blogsAPI.list(),
  );
  const { data: allGallery, loading: loadingGallery } = useFetch<any[]>(() =>
    galleryAPI.list(),
  );

  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <ServicesPreview services={allServices ?? []} loading={loadingServices} />
      <SolutionsPreview
        solutions={allSolutions ?? []}
        loading={loadingSolutions}
      />
      <BlogsPreview blogs={allBlogs ?? []} loading={loadingBlogs} />
      <HowItWorksSection />
      <GalleryPreview items={allGallery ?? []} loading={loadingGallery} />
      <FAQSection />
      <CTASection />
    </PublicLayout>
  );
}
