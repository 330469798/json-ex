import produce from "immer"

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
        isDeleteKey: true,
        defaultValue: null,
        leafResFn: (data: any) => {
            return data
        },
        isSkipCheck: false
    }
    option = { ...defaultOption, ...option };
    const { resFn, defaultValue, isDeleteKey, leafResFn, isSkipCheck } = option as groupByNamesOption

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
    a: { [key: string]: any }[],//被合入数据
    b: { [key: string]: any }[],//合入数据,若有相同字段b会覆盖a
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
    const bn: string = bname ?? aname
    const map = new Map();
    b.forEach((item: { [key: string]: any }) => {
        map.set(item[bn], item)
    })

    return a.map((item: { [key: string]: any }) => {
        const d = map.get(item[aname])
        if (!Array.isArray(field)) {
            if (d?.[field as string]) item[field as string] = d?.[field as string];
        }
        else {
            (field as string[]).forEach((f: string) => {
                if (d?.[f]) item[f] = d?.[f];
            })
        };
        return item;
    })
}

interface treeLayerValidateOption {
    //父节点主键字段名
    parentIdField?: string,
    // 节点主键字段名
    idField?: string,
    //校验方法
    validateFn?: Function
    // 校验错误提示
    errorMsgFn?: Function,
    //根节点id
    rootId?: number | string,
}
//树型json数据的层级校验
export function treeLayerValidate(
    data: any[],
    option: treeLayerValidateOption
) {
    // 默认配置
    const defaultOption = {
        parentIdField: "parentId",
        idField: `id`,
        validateFn: (data: any) => {
            return true
        },
        errorMsgFn: (data: any) => {
            return `error`
        },
        rootId: `0`
    }

    option = { ...defaultOption, ...option }
    const { parentIdField, idField, validateFn, errorMsgFn, rootId } = option as treeLayerValidateOption

    const map = new Map();
    data.forEach((item, i) => {
        if (item[parentIdField]) {
            const o = map.get(item[parentIdField])

            o
                ? o.push(item)
                : map.set(item[parentIdField], [item])
        }
    })
    const rootNode = data.find(item => item[idField] === rootId) ?? data[0]
    const errorMsg: any[] = []
    const dp = (node: any) => {
        const children = map.get(node[idField])
        if (children) {
            if (!validateFn(children)) errorMsg.push(errorMsgFn(children))
            children.forEach((item: any) => dp(item))
        }
    }

    dp(rootNode)
    return errorMsg;
}


interface uniqueJsonByKeyOption {
    //reserve为从尾部去重
    mode?: string

    keyField?: string
}

export function uniqueJsonByKey(list: any[], option?: uniqueJsonByKeyOption) {
    const defaultOption = {
        mode: "default",
        keyField: `key`
    }

    option = { ...defaultOption, ...option }
    const { mode, keyField } = option as any
    list = deepClone(list)

    const filter = (list) => {
        const map = new Map();
        const outputArr: any[] = []
        list.forEach(item => {
            const o = map.get(item[keyField])
            !o && (
                map.set(item[keyField], item),
                outputArr.push(item)
            )
        })

        return outputArr
    }

    return mode === `reverse` ? filter(list.reverse()).reverse() : filter(list)
}



export function deepClone(list, fn?: Function): any {
    return produce(list, (draft) => { return fn ? fn(draft) : draft })
}

