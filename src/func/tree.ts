import { deepClone } from "./json"

interface TreeOption {
    idField?: string
    nameField?: string,
    //子节点主键字段名
    childrenField?: string
    //父节点主键字段名
    parentIdField?: string,
    // 根节点id
    rootId: string | number,
}

interface toTreeOption extends TreeOption {
    //父节点主键字段名
    parentIdField: string,
    //自定义叶子结点数据类型
    leafResFn: Function,
    //自定义所有结点的数据类型
    resFn: Function
}


export function toTree(
    arr: any[],//数据
    option?: { [key: string]: any }//配置
): { [key: string]: any }[] {

    //默认配置
    option = {
        parentIdField: "parentId",
        idField: `id`,
        rootId: `0`,
        childrenField: `children`,
        leafResFn: (data: any, layer: number) => {
            return {
                ...data,
                isLeaf: true,
            }
        },
        resFn: (data: any, layer: number) => {
            return {
                ...data,
                layer
            }
        },
        ...option
    }

    const { parentIdField, idField, rootId, childrenField, leafResFn, resFn } = option as toTreeOption

    //id=>childrenList
    const childrenMap = new Map();
    arr.forEach((item: any) => {
        const children = childrenMap.get(item[parentIdField])

        children
            ? children.push(item)
            : childrenMap.set(item[parentIdField], [item])
    })

    //深度
    let layer = 0;
    const dp = (nodes: any[]) => {
        return nodes.map(item => {
            const children = childrenMap.get(item[idField]);
            if (children) {
                layer++
                item[childrenField] = dp(children);
                layer--
            }
            // 生成叶子结点
            if (!children && leafResFn) item = leafResFn(item, layer)
            // 生成节点
            return resFn ? resFn(item, layer) : item;
        })
    }

    const nodesArr = arr.filter((item: any) => item[parentIdField] === rootId)
    return dp(nodesArr)
}

interface FindNodesByKeyOption extends TreeOption {

}

export function findNodesByKey(list: any[], key, option?: FindNodesByKeyOption) {
    //深拷贝防止改变源数据
    list = deepClone(list)
    if (!key) return list;

    const defaultOption = {
        nameField: `title`,
        childrenField: `children`,
    }

    option = { ...defaultOption, ...option }
    const { nameField, childrenField } = option as any

    const dp = (layerList) => {
        return layerList.filter(item => {
            const children = item[childrenField] && dp(item[childrenField])
            item[childrenField] = children?.length ? children : undefined;
            return children?.length || item[nameField].includes(key)
        })
    }

    return dp(list)
}

interface IsTreeNodeOption extends TreeOption {

}

export function isTreeNode(list: any[], key, option?: IsTreeNodeOption) {
    const defaultOption = {
        idField: `key`,
        childrenField: `children`,
    }

    option = { ...defaultOption, ...option }
    const { idField, childrenField } = option as any

    const dp = (layerList) => {
        return !!layerList.find(item => {
            return item[idField] === key || (item[childrenField] && dp(item[childrenField]))
        })
    }

    return dp(list)
}