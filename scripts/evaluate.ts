import fs from "fs";
import { askLegalAssistant }
from "../src/lib/rag/ask";

async function main() {

const tests =
JSON.parse(
fs.readFileSync(
"./evaluation/legal-test-set.json",
"utf8"
)
);

let passed = 0;

for (const test of tests) {

const result =
await askLegalAssistant(
test.question
);

const answer =
String(
result.answer ?? ""
).toLowerCase();

const retrievedSources =
result.sources.map(
(s:any)=>s.title
);

const sourceFound =
retrievedSources.some(
(source:string)=>
source.includes(
test.expectedSource
)
);

const matchedKeywords =
test.mustContain.filter(
(keyword:string)=>
answer.includes(
keyword.toLowerCase()
)
);

const missingKeywords =
test.mustContain.filter(
(keyword:string)=>
!answer.includes(
keyword.toLowerCase()
)
);

const success =
sourceFound &&
missingKeywords.length===0;

console.log(
"\n========================================"
);

console.log(
`Question:
${test.question}`
);

console.log(
`\nExpected Source:
${test.expectedSource}`
);

console.log(
"\nActual Sources:"
);

retrievedSources.forEach(
(source:string)=>
console.log(
`• ${source}`
)
);

console.log(
"\nExpected Keywords:"
);

test.mustContain.forEach(
(keyword:string)=>
console.log(
`• ${keyword}`
)
);

console.log(
"\nMatched Keywords:"
);

if(
matchedKeywords.length===0
){
console.log(
"None"
);
}
else{

matchedKeywords.forEach(
(keyword:string)=>
console.log(
`✓ ${keyword}`
)
);

}

console.log(
"\nMissing Keywords:"
);

if(
missingKeywords.length===0
){
console.log(
"None"
);
}
else{

missingKeywords.forEach(
(keyword:string)=>
console.log(
`✗ ${keyword}`
)
);

}

console.log(
"\nGenerated Answer:"
);

console.log(
result.answer.slice(
0,
700
)
);

console.log(
`\nRESULT:
${success ? "PASS ✅" : "FAIL ❌"}`
);

console.log(
"========================================"
);

if(success)
passed++;

}

console.log(
`\nFINAL SUMMARY`
);

console.log(
`Passed:
${passed}/${tests.length}`
);

console.log(
`Failed:
${tests.length-passed}/${tests.length}`
);

const score =
(
(passed/tests.length)
*100
).toFixed(2);

console.log(
`Accuracy:
${score}%`
);

}

main();