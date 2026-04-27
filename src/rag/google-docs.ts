import { google } from "googleapis";
import type { docs_v1 } from "googleapis";

import { googleDocId, googlePrivateKey, googleServiceAccountEmail } from "../config/env.js";

export interface GoogleDocText {
  id: string;
  title: string;
  text: string;
}

export async function readGoogleDocText(documentId = googleDocId): Promise<GoogleDocText> {
  const auth = new google.auth.JWT({
    email: googleServiceAccountEmail,
    key: googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/documents.readonly"],
  });

  const docs = google.docs({ version: "v1", auth });
  const response = await docs.documents.get({ documentId });
  const document = response.data;

  return {
    id: documentId,
    title: document.title ?? documentId,
    text: extractText(document.body?.content ?? []),
  };
}

function extractText(content: docs_v1.Schema$StructuralElement[]): string {
  return content
    .map((element) => {
      if (element.paragraph) {
        return extractParagraphText(element.paragraph);
      }

      if (element.table) {
        return element.table.tableRows
          ?.flatMap((row) => row.tableCells ?? [])
          .flatMap((cell) => cell.content ?? [])
          .map((element) => extractText([element]))
          .join("\n") ?? "";
      }

      if (element.tableOfContents) {
        return extractText(element.tableOfContents.content ?? []);
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function extractParagraphText(paragraph: docs_v1.Schema$Paragraph): string {
  return paragraph.elements
    ?.map((element) => element.textRun?.content ?? "")
    .join("") ?? "";
}
