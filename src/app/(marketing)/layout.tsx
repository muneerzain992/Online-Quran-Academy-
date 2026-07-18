import {
  BackToTop,
  Footer,
  Loader,
  Navbar,
  WhatsAppFab,
} from "@/components/layout";
import { PageTransition, SmoothScroll } from "@/components/motion";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="flex min-h-full flex-col bg-hero-glow">
        <Loader />
        <Navbar />
        <main
          id="main-content"
          className="flex-1 pb-20 sm:pb-16"
          tabIndex={-1}
        >
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFab />
        <BackToTop />
      </div>
    </SmoothScroll>
  );
}
