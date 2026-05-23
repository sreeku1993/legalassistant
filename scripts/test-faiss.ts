import {
  createVectorStore,
  saveVectorStore,
  loadVectorStore
}
from "../src/lib/vector/faiss";

async function main() {

  const store =
    await createVectorStore();

  await store.addDocuments([
    {
      pageContent:
      "Section 302 of Bharatiya Nyaya Sanhita deals with punishment for murder.",

      metadata: {
        source:
        "BNS"
      }
    }
  ]);

  await saveVectorStore(
    store
  );

  console.log(
    "Saved"
  );

  const loadedStore =
    await loadVectorStore();

  const results =
    await loadedStore.similaritySearch(
      "murder punishment",
      1
    );

  console.log(results);
}

main();