import { askLegalAssistant }
from "../src/lib/rag/ask";

async function main() {

  const result =
    await askLegalAssistant(
      "What is punishment for murder?"
    );

  console.log(
    "\nANSWER:\n"
  );

  console.log(
    result.answer
  );

  console.log(
    "\nSOURCES:\n"
  );

  console.log(
    result.sources
  );
}

main();