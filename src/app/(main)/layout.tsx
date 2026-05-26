import { BackToTop } from "@/app/components/layout/BackToTop";
import { Footer } from "@/app/components/layout/Footer";
import { Header } from "@/app/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div id="top"></div>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
