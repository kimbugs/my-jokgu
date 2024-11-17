import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      <Head>
        <title>Next.js + DaisyUI</title>
        <meta
          name="description"
          content="Next.js와 DaisyUI를 사용하는 프로젝트"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">My Next.js App</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-white hover:text-accent">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-accent">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-accent">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6">
          <h2 className="text-3xl font-semibold mb-4">
            Welcome to Next.js with DaisyUI
          </h2>
          <p className="mb-6 text-lg">
            This is a simple template using Next.js and DaisyUI!
          </p>
          <button className="btn btn-primary">Click Me!</button>
        </div>
      </main>

      <footer className="bg-primary p-4 mt-8">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 My Next.js App</p>
        </div>
      </footer>
    </div>
  );
}
