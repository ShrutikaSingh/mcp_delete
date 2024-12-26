import { createClient } from '@/lib/supabase/server';
import Form from 'next/form';
import { toast } from 'sonner';

export const SignOutForm = () => {
  return (
    <Form
      className="w-full"
      action={async () => {
        'use server';

        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
          toast.error(`Failed to sign out: ${error.message}`);
        }
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </Form>
  );
};
