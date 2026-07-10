import { existsSync } from "node:fs";
import path from "node:path";

export function publicAssetExists(assetPath: string) {
  const normalized = assetPath.replace(/^\/+/, "");
  return existsSync(path.join(process.cwd(), "public", normalized));
}
