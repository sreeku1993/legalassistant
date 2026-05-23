let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    const { pipeline } =
      await import("@xenova/transformers");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
}

async function generateEmbedding(
  text: string
): Promise<number[]> {

  const model =
    await getExtractor();

  const output =
    await model(text, {
      pooling: "mean",
      normalize: true
    });

  return Array.from(output.data);
}

export async function getEmbeddings() {
  return {

    async embedQuery(
      text: string
    ): Promise<number[]> {

      return await generateEmbedding(
        text
      );
    },

    async embedDocuments(
      texts: string[]
    ): Promise<number[][]> {

      return await Promise.all(
        texts.map(generateEmbedding)
      );
    }
  };
}