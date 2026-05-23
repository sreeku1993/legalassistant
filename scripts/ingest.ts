import fs from "fs";
import path from "path";
import {
 addDocuments
}
from "../src/lib/vector/vectra";

import {
 getEmbeddings
}
from "../src/lib/embeddings/gemini";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { chunkLegalText } from "../src/lib/rag/chunker";
const ROOT_DIR = "./legal-data";

function getPdfFiles(dir: string): string[] {
  let results: string[] = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getPdfFiles(fullPath));
    } else if (file.toLowerCase().endsWith(".pdf")) {
      results.push(fullPath);
    }
  }

  return results;
}

function generateMetadata(filePath: string) {
  const fileName = path.basename(filePath, ".pdf");

  const parts = filePath.split(path.sep);

  return {
    title: fileName.replaceAll("_", " "),
    category: parts[parts.length - 2],
    documentType: parts.includes("acts")
      ? "act"
      : "judgment",
    source: filePath
  };
}

async function processPdf(filePath: string) {
  try {
    const loader = new PDFLoader(filePath);

    const docs = await loader.load();

    const fullText = docs
      .map(doc => doc.pageContent)
      .join("\n");

    return {
      metadata: generateMetadata(filePath),
      text: fullText,
      pages: docs.length
    };

  } catch(error) {
    console.error(`Error processing ${filePath}`);
    console.error(error);

    return null;
  }
}

async function main() {

  console.log(
    "\nScanning PDFs...\n"
  );

  const pdfFiles =
    getPdfFiles(ROOT_DIR);

  console.log(
    `Found ${pdfFiles.length} PDFs`
  );

  const embeddings =
    await getEmbeddings();

  for (const file of pdfFiles) {

    console.log(
      `Processing: ${path.basename(file)}`
    );

    const result =
      await processPdf(file);

    if (!result) continue;

    const chunks =
      await chunkLegalText(
        result.text
      );

    const docs =
      await Promise.all(

        chunks.map(
          async chunk => ({

            pageContent:
              chunk.pageContent,

            metadata: {
              ...result.metadata
            },

            embedding:
              await embeddings.embedQuery(
                chunk.pageContent
              )
          })
        )
      );

    await addDocuments(
      docs
    );

    console.log(
      `Added ${docs.length} chunks`
    );
  }

  console.log(
    "\nVectra database saved"
  );
}

main();


