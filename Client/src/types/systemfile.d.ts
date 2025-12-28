declare module "expo-file-system" {
  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: {
      encoding?: "utf8" | "base64";
    }
  ): Promise<void>;

  export const cacheDirectory: string | null;
}