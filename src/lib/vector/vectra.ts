import { LocalIndex } from "vectra";
import path from "path";

const index = new LocalIndex(
  path.join(
    process.cwd(),
    "legal-data",
    "vectra-index"
  )
);

export async function getIndex() {

  if (
    !(await index.isIndexCreated())
  ) {
    await index.createIndex();
  }

  return index;
}

export async function addDocuments(
  docs: {
    pageContent: string;
    metadata: any;
    embedding: number[];
  }[]
) {

  const index =
    await getIndex();

  for (const [i, doc] of docs.entries()) {

    await index.insertItem({

      id: `${Date.now()}-${i}`,

      vector:
        doc.embedding,

      metadata: {
        text:
          doc.pageContent,

        ...doc.metadata
      }
    });
  }
}

export async function searchDocuments(
  embedding: number[],
  query = "",
  limit = 5
) {

  const index =
    await getIndex();

  const results =
    await index.queryItems(
      embedding,
      query,
      limit
    );

  return results;
}