import { RecursiveCharacterTextSplitter }
from "@langchain/textsplitters";

function cleanLegalText(text: string) {
  return text
    // Remove arrangement/table-of-content blocks
    .replace(
      /(ARRANGEMENT OF SECTIONS|ARRENGMENT OF SECTIONS|ARRANGEMENT OF CLAUSES)[\s\S]*?CHAPTER I/gi,
      "CHAPTER I"
    )

    // Remove amendment listings
    .replace(
      /LIST OF AMENDING ACTS[\s\S]*?CHAPTER I/gi,
      "CHAPTER I"
    )

    // Remove page numbers alone on lines
    .replace(/^\d+$/gm, "")

    // Remove repeated blank lines
    .replace(/\n+/g, "\n")

    .trim();
}

export async function chunkLegalText(
  text: string
) {
  const cleanedText =
    cleanLegalText(text);

  const splitter =
    new RecursiveCharacterTextSplitter({

     chunkSize: 900,
chunkOverlap: 100,

      separators: [
    "\n\\d+\\.",
    "\nSECTION",
    "\nSection",
    "\nCHAPTER",
    "\nChapter",
    "\nPART",
    "\nPart",
    "\n\n",
    "\n"
]
    });

  return await splitter.createDocuments([
    cleanedText
  ]);
}