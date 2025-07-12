import { storageClient } from "~/utils/lens/storage";

export async function uploadMetadata(data: any): Promise<string> {
  try {
    const metadataFile = new File([JSON.stringify(data)], "metadata.json", { type: "application/json" });

    const { uri } = await storageClient.uploadFile(metadataFile);

    if (!uri) {
      throw new Error("Failed to upload metadata");
    }

    return uri;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
