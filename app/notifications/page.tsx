import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">MayBe chart</h2>
      <div className="mb-6 text-lg">
        {session?.user ? (
          <div>
            {session?.user.userId}, {session?.user.name}, {session?.user.role}
          </div>
        ) : (
          <div>Need Login</div>
        )}
      </div>
    </div>
  );
}
