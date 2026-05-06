import { Navbar } from "./Navbar";

export function Header() {
  return (
    <div className="fixed top-0 w-full z-50">
      <div className="container">
        <div className="py-3">
          <Navbar />
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
