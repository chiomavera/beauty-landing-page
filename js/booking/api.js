import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://llmwcqivyuqytbtqcaoz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbXdjcWl2eXVxeXRidHFjYW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjE0NzMsImV4cCI6MjA4NTY5NzQ3M30.4UBQ8aPfdTylIyjWUjr7rn2xvcRmpizd1elxxmjGMVk",
);

export async function createBooking(data) {
  const { error } = await supabase
    .from("bookings")
    .insert([data]);

  if (error) throw error;
}