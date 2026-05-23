import { getEmbeddings }
from "../src/lib/embeddings/gemini";

import {
  searchDocuments
}
from "../src/lib/vector/vectra";

async function main() {

  const question =
    "What is punishment for murder?";

  const embeddings =
    await getEmbeddings();

  const vector =
    await embeddings.embedQuery(
      question
    );

  const results =
    await searchDocuments(
      vector,
      question,
      5
    );

  console.log("\nRESULTS:\n");

  results.forEach(
  (result, index) => {

    console.log(
      `Result ${index + 1}`
    );

    console.log(result);

    console.log(
      "\n-----------------\n"
    );
  }
);

}

main();