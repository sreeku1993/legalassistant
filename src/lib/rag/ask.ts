import { getEmbeddings }
from "../embeddings/gemini";

import {
  searchDocuments
}
from "../vector/vectra";

import { llm }
from "./llm";

export async function askLegalAssistant(
  question: string
) {

  const embeddings =
    await getEmbeddings();

  const queryEmbedding =
    await embeddings.embedQuery(
      question
    );

  const docs =
    await searchDocuments(
      queryEmbedding,
      question,
      5
    );

  const context =
    docs.map(
      (doc,index)=>`

Source ${index+1}

Title:
${doc.item.metadata.title}

Category:
${doc.item.metadata.category}

Content:
${doc.item.metadata.text}

`
    ).join("\n");

  const prompt = `
You are an Indian legal assistant.

Rules:

- Use only provided context
- Do not invent laws
- Cite sources used
- If uncertain, say so
- Format responses in Markdown
- Use headings and bullet points
- Mention section numbers when available

Question:
${question}

Context:
${context}
`;

  const response =
    await llm.invoke(
      prompt
    );

  return {

    answer:
      response.content,

    sources: [
  ...new Map(
    docs.map(d => [
      d.item.metadata.title,
      {
        title:
          d.item.metadata.title,

        category:
          d.item.metadata.category,

        documentType:
          d.item.metadata.documentType
      }
    ])
  ).values()
]
  };
}