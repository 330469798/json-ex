interface toTreeOption {
    //父节点主键字段名
    parentIdField?: string,
    // 节点主键字段名
    idField?: string,
    // 根节点id
    rootId?: string | number,
    // 递归字段
    dpName?: string,
    //自定义叶子结点数据类型
    leafResFn?: Function,
    //自定义所有结点的数据类型
    resFn?: Function
}


export function toTree(
    arr: any[],//数据
    option: toTreeOption//配置
): { [key: string]: any } {

    //默认配置
    option = {
        parentIdField: "parentId",
        idField: `id`,
        rootId: `0`,
        dpName: `children`,
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

    const { parentIdField, idField, rootId, dpName, leafResFn, resFn } = option as toTreeOption

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
                item[dpName] = dp(children);
                layer--
            }
            // 生成叶子结点
            if (!children && leafResFn) item = leafResFn(item, layer)
            // 生成节点
            return resFn ? resFn(item, layer) : item;
        })
    }

    const nodesArr = arr.filter((item: any) => item[parentIdField] === rootId)
    if (!nodesArr.length) console.warn(`toTree方法未找到根节点`)

    return dp(nodesArr)
}