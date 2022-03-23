import { jsonMerge } from "../dist/index";

const jsonMergeDemo = [{ id: 1, name: 1 }, { id: 2 }];
const jsonMergeDemo1 = [
  { id: 1, name: `张三`, age: 10 },
  { id: 2, name: `李四`, age: 20 },
];
console.log(`jsonMerge:`);
console.log(jsonMerge(jsonMergeDemo, jsonMergeDemo1, `id`));
