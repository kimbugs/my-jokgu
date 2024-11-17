import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">족구</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-accent">
              Home
            </Link>
          </li>
          <li>
            <Link href="/game" className="text-white hover:text-accent">
              경기
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:text-accent">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
