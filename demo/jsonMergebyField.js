import { jsonMergebyField } from "../dist/index";

const jsonMergebyFieldDemo = [{ id: 1 }, { id: 2 }];
const jsonMergebyFieldDemo1 = [
  { id: 1, name: 1, age: 10 },
  { id: 2, name: 2, age: 20 },
];
console.log(`jsonMergebyField:`);
console.log(
  jsonMergebyField(jsonMergebyFieldDemo, jsonMergebyFieldDemo1, `id`, `name`)
);
