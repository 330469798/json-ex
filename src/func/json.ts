import { Heap } from "./heap"

export const getItemByValue = (list, value, valueField = `value`) => {
    return list.find(item => item[valueField] === value) ?? {}
}

interface groupByNamesOption {
    // 自定义分组后非叶子结点数据结构
    resFn?: (key: string | string[], value: any, layer: number) => {},
    // 未找到分类的默认名称,为null时过滤该分组
    defaultValue?: any,
    // 分组后的child对象是否删除key
    isDeleteKey?: boolean
    // 自定义分组后叶子结点数据结构
    leafResFn?: (data: any, layer: number) => {}
    // 是否跳过检查自定义的fn无返回值的问题
    isSkipCheck?: boolean
}

// 分组
export function groupByNames(
    arr: { [key: string]: any }[],// 数据
    option: groupByNamesOption,// 配置
    ...args: (string | string[])[]// 分组参数,string为单字段分组,string[]为组合分组
): { [key: string]: any }[] {
    if (!arr.length)
        return arr;

    // 默认配置
    const defaultOption = {
        resFn: (key: string | string[], value: any) => {
            return {
                label: Array.isArray(key)
                    ? key
                        .map(item => item ?? `--`)
                        .join(`,`)
                    : key,
                children: value,
            }
        },
        isDeleteKey: false,
        defaultValue: null,
        leafResFn: (data: any) => {
            return data
        },
        isSkipCheck: false
    }
    option = { ...defaultOption, ...option };
    const { resFn, defaultValue, isDeleteKey, leafResFn, isSkipCheck } = option as any

    // 递归指针
    let i: number = 0;
    // 递归函数
    const dp = (arr: { [key: string]: any }[], name: string | string[]): { [key: string]: any }[] => {
        // 生成叶子节点
        if (!name)
            return leafResFn
                ? arr.map(item => {
                    const leaf = leafResFn(item, i)

                    !leaf && !isSkipCheck && console.warn(`Warning:groupByNames方法的参数option.leafResponseFn没有返回值`);

                    return leaf;
                })
                : arr;

        // 通过map实现分组
        const map: Map<string, any> = new Map();
        arr.forEach((item: { [key: string]: any }) => {
            const v: string | undefined =
                Array.isArray(name)
                    ? JSON.stringify(name.map(n => item[n]))
                    : item[name];
            const o: { [key: string]: any }[] = map.get(v ?? defaultValue);
            const dv = v ?? defaultValue

            if (dv !== null) {
                v && isDeleteKey && Array.isArray(name)
                    ? name.forEach(names => delete item[names])
                    : delete item[name as string];

                o
                    ? o.push(item)
                    : map.set(dv, [item]);
            }
        })

        // 递归生成每个非叶子节点
        const data = [...map].map((item: any[]) => {
            const [k, v] = item;

            const d = resFn(
                Array.isArray(name) ? JSON.parse(k) : k,
                dp(v, args[++i]),
                i
            )
            i--;

            !d && !isSkipCheck && console.warn(`Warning:groupByNames方法的参数option.fn没有返回值`)
            return d;
        });

        return data;
    }

    return dp(arr, args[i])
}

// 数据合并
export function jsonMerge(
    a: { [key: string]: any }[] = [],//被合入数据
    b: { [key: string]: any }[] = [],//合入数据,若有相同字段b会覆盖a
    aname: string,//a的aname与b的bname字段匹配
    bname?: string,//默认值为aname
): { [key: string]: any }[] {
    const bn: string = bname ?? aname
    const map = new Map();
    b.forEach((item: { [key: string]: any }) => {
        map.set(item[bn], item)
    })

    return a.map((item: { [key: string]: any }) => {
        return { ...item, ...map.get(item[aname]) }
    })
}

// 部分数据合并
export function jsonMergebyField(
    a: { [key: string]: any }[],//被合入数据
    b: { [key: string]: any }[],//合入数据,若有相同字段b会覆盖a
    aname: string,//a的aname与b的bname字段匹配
    field: string | string[],
    bname?: string,//默认值为aname
): { [key: string]: any }[] {
    const mergeFn = (a, b) => {
        if (!Array.isArray(field)) {
            if (b?.[field as string]) a[field as string] = b?.[field as string];
        }
        else {
            (field as string[]).forEach((f: string) => {
                if (b?.[f]) a[f] = b?.[f];
            })
        };
        return a;
    }

    return jsonMergebyFn(a, b, aname, mergeFn, bname)
}

// 自定义的数据合并
export function jsonMergebyFn(
    a: { [key: string]: any }[] = [],//被合入数据
    b: { [key: string]: any }[] = [],//合入数据,若有相同字段b会覆盖a
    aname: string,//a的aname与b的bname字段匹配
    mergeFn: (a, b) => any,
    bname?: string,//默认值为aname
): { [key: string]: any }[] {
    const bn: string = bname ?? aname
    const map = new Map();
    b.forEach((item: { [key: string]: any }) => {
        map.set(item[bn], item)
    })

    return a.map((item: { [key: string]: any }) => {
        return mergeFn(item, map.get(item[aname]))
    })
}

interface uniqueJsonByKeyOption {
    //default优先保留头部 reserve优先保留尾部
    mode?: string

    keyField?: string

    getKey?: (item) => String
}

export function uniqueJsonByKey(list: any[], option?: uniqueJsonByKeyOption) {
    const defaultOption = {
        mode: "default",
        keyField: `key`,
        getKey: (item) => {
            return item?.[option.keyField ?? `key`]
        }
    }

    option = { ...defaultOption, ...option }
    const { mode, getKey } = option as any

    const filter = (list) => {
        const map = new Map();
        const outputArr: any[] = []
        list.forEach(item => {
            const o = map.get(getKey(item))
            !o && (
                map.set(getKey(item), item),
                outputArr.push(item)
            )
        })

        return outputArr
    }

    return mode === `reverse` ? filter(list.reverse()).reverse() : filter(list)
}

export function deepClone(list: { [key: string]: any }[] | { [key: string]: any }) {
    const getCloneObj = (item: any) => {
        return typeof item === `object` ? deepClone(item) : item
    }
    // console.log(list)
    // console.log(typeof list)

    if (Array.isArray(list))
        return list.map(item => getCloneObj(item))
    else if (list instanceof Map) {
        return new Map([...list].map(item => {
            item[1] = getCloneObj(item[1])
            return item;
        }))
    }
    else if (list instanceof Set) {
        return new Set([...list])
    }
    else {
        const allKeys = Reflect.ownKeys(list);
        return allKeys.reduce((a, b) => {
            return {
                ...a,
                [b]: getCloneObj(Reflect.get(list, b))
            }
        }, {});
    }
}

export function getTopN(list, compare: Function, n: number) {
    const heap = Heap.heapify(list, compare)
    const size = heap.size
    const result = [];

    for (let i = 0; i < Math.min(n, size); i++) {
        result.push(heap.pop())
    }
    return result
}