import { treeLayerValidate } from "../dist/index";

const treeLayerValidateDemo = [
  {
    id: 1,
    pid: 0,
    value: `1`,
  },
  {
    id: 2,
    pid: 1,
    value: `0.2`,
  },
  {
    id: 3,
    pid: 1,
    value: `0.3`,
  },
  {
    id: 4,
    pid: 1,
    value: `0.4`,
  },
  {
    id: 5,
    pid: 4,
    value: `0.5`,
  },
  {
    id: 6,
    pid: 4,
    value: `0.6`,
  },
];

console.log(`treeLayerValidate:`);
console.log(
  treeLayerValidate(treeLayerValidateDemo, {
    parentIdField: "pid",
    rootId: 0,
    validateFn: (data) => {
      return eval(data.map((item) => item.value).join(`+`)) === 1;
    },
    errorMsgFn: (data) => {
      return `id为${data.map((item) => item.id).join(`,`)}的对象之和不为1`;
    },
  })
);
