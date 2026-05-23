import { getIndex }
from "../src/lib/vector/vectra";

async function main() {

  const index =
    await getIndex();

  console.log(
    "Index initialized"
  );

  console.log(index);
}

main();