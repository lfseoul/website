import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // In Next.js 15, draftMode() is asynchronous
  const draft = await draftMode();
  draft.enable();
  
  // Redirect back to your English homepage (or use a dynamic URL if preferred)
  redirect("/en");
}