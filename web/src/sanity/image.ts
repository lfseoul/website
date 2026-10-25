import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || "934555f8",
  dataset: client.config().dataset || "production",
});

export function urlFor(source: any) {
  return builder.image(source);
}