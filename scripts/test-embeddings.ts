import { getEmbeddings }
from "../src/lib/embeddings/gemini";

async function main() {

  const embeddings =
    await getEmbeddings();

  const vector =
    await embeddings.embedQuery(
      "What is Section 302 of Bharatiya Nyaya Sanhita?"
    );

  console.log(
    "Vector length:",
    vector.length
  );

  console.log(
    vector.slice(0,10)
  );
}

main();