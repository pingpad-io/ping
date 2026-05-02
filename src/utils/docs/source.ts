import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { i18n } from "~/utils/i18n";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
});
