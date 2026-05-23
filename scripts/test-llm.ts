import { llm } from "../src/lib/rag/llm";

async function main() {
  try {
    const response = await llm.invoke(
      "What is the purpose of the Constitution of India? Answer in 2 sentences."
    );

    console.log(response.content);

  } catch (error) {
    console.error(error);
  }
}

main();