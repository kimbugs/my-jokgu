import Head from "next/head";

export default function Home() {
  return (
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
  );
}
