import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-4 mb-4">
          <h2 className="font-medium text-xl">Welcome to Your App</h2>
          <p>This is your customized Supabase starter template. You can edit this page or navigate to your new home page.</p>
          <Link 
            href="/home" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md w-fit"
          >
            Go to Home Page
          </Link>
        </div>
        
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}