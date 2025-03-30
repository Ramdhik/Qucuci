import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Hero from '@/components/hero';
import About from '@/components/about';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Hero />
      <About />
    </>
  );
}
