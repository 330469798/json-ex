import { toTree } from "../dist/index";

const toTreeDemo = [
  {
    id: 1,
    pid: 0,
    value: `root`,
  },
  {
    id: 2,
    pid: 1,
    value: `layer1-1`,
  },
  {
    id: 3,
    pid: 1,
    value: `layer1-2`,
  },
  {
    id: 4,
    pid: 1,
    value: `layer1-3`,
  },
  {
    id: 5,
    pid: 4,
    value: `layer2-1`,
  },
  {
    id: 6,
    pid: 4,
    value: `layer2-2`,
  },
];

console.log(`toTree:`);
console.log(
  toTree(toTreeDemo, {
    parentIdField: `pid`,
    rootId: 0,
  })
);
