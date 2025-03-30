import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
        <p className="text-lg mb-6">This is your new home page. You can customize it however you like.</p>

        {!user ? (
          <div className="flex gap-4">
            <Link href="/sign-in" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Sign In
            </Link>
            <Link href="/sign-up" className="border border-primary text-primary px-4 py-2 rounded-md">
              Sign Up
            </Link>
          </div>
        ) : (
          <Link href="/protected" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Go to Dashboard
          </Link>
        )}
      </section>

      {/* Add more sections as needed */}
      <section className="w-full mt-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
            <p>Description of feature 1.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
            <p>Description of feature 2.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
            <p>Description of feature 3.</p>
          </div>
        </div>
      </section>

      {/* Link back to tutorial page */}
      <section className="w-full mt-8">
        <p className="text-sm text-secondary-foreground">
          Need to see the Supabase tutorial again?{' '}
          <Link href="/" className="text-primary underline">
            Go back to the tutorial page
          </Link>
        </p>
      </section>
    </div>
  );
}
