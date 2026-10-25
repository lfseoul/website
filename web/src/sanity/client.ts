import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "925755f8",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Set to false to see text updates instantly
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
});