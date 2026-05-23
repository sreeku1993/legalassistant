import { loadVectorStore }
from "../src/lib/vector/faiss";

async function main() {

  const store =
    await loadVectorStore();

  const results =
    await store.similaritySearch(
      "What is punishment for murder?",
      3
    );

  console.log("\nRESULTS:\n");

  results.forEach(
    (doc,index) => {

      console.log(
        `Result ${index+1}`
      );

      console.log(
        doc.metadata
      );

      console.log(
        doc.pageContent.slice(
          0,
          400
        )
      );

      console.log(
        "\n-----------------\n"
      );
    }
  );
}

main();