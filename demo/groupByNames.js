import { groupByNames } from "../dist/index";

const groupByNamesDemo = [
  {
    select: "33",
    nid: "3581",
    name: "22",
    title: "11",
    tid: "3579",
  },
  {
    select: "333",
    nid: "3581",
    name: "22",
    title: "11",
    tid: "3579",
  },
  {
    select: "123",
    nid: "3581",
    name: "22",
    title: "11",
    tid: "3579",
  },
  {
    select: "hjk",
    nid: "3586",
    name: "asdf",
    title: "11",
    tid: "3579",
  },
  {
    select: "sdf",
    nid: "3586",
    name: "asdf",
    title: "11",
    tid: "3579",
  },
  {
    select: "sg",
    nid: "3589",
    name: "smgui",
    title: "1",
    tid: "3576",
  },
  {
    select: "g",
    nid: "3589",
    name: "smgui",
    title: "1",
    tid: "3576",
  },
];

console.log(`groupByNames:`);
console.log(
  groupByNames(
    groupByNamesDemo,
    {
      resFn: (key, value, layer) => {
        if (layer === 1) {
          return {
            title: key[0],
            tid: key[1],
            contentArr: value,
          };
        }
        if (layer === 2) {
          return {
            name: key[0],
            nid: key[1],
            select: value,
          };
        }
      },
      leafResFn: (data) => {
        return data.select;
      },
    },
    [`title`, `tid`],
    [`name`, `nid`]
  )
);
