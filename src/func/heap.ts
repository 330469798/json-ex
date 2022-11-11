export class Heap {
    arr = [0]
    defaultCompare = (a, b) => { return a < b }
    compare;
    constructor(compare: Function | undefined) {
        this.compare = (typeof compare === 'function') ? compare : this.defaultCompare;
    }

    /**
    * 堆中元素数量
    */
    get size() {
        return this.arr.length - 1;
    }

    /**
     * 根据可迭代对象生成堆
     * @param {*} data iterable 对象
     * @param {*} compare
     */
    static heapify(data, compare: Function | undefined) {
        let heap = new Heap(compare);
        for (let item of data) {
            heap.push(item);
        }
        return heap;
    }

    /**
    * 入队
    */
    push(item) {
        let { arr } = this;
        arr.push(item); //添加到末尾
        this.up(arr.length - 1); // 尝试上浮
    }

    /**
    * 向上调整
    */
    up(k) {
        let { arr, compare, parent } = this;
        while (k > 1 && compare(arr[k], arr[parent(k)]) > 0) {
            this.swap(parent(k), k);
            k = parent(k);
        }
    }

    /**
    * 交换位置
    */
    swap(i, j) {
        let arr = this.arr;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    /**
    * 左孩子
    */
    left(k) { return k * 2; }

    /**
    * 右孩子
    */
    right(k) { return k * 2 + 1; }

    /**
    * 双亲
    */
    parent(k) { return Math.floor(k / 2); }

    /**
     * 向下调整
     * @param {int} k
     */
    down(k) {
        let { arr, compare, left, right } = this;
        let size = this.size;
        // 如果沉到堆底，就沉不下去了
        while (left(k) <= size) {
            let child = left(k);
            if (right(k) <= size && compare(arr[right(k)], arr[child]) > 0) {
                child = right(k); // 选择左右子节点中更靠近堆顶的，这样能维持下沉后原本的 left与right 之间的顺序关系
            }
            // 如果当前的k比子节点更靠近堆顶，不用下沉了
            if (compare(arr[k], arr[child]) > 0) return;
            // 下沉
            this.swap(k, child);
            k = child;
        }
    }

    /**
    * 返回优先级最高元素，出队
    */
    pop(): any {
        if (this.size === 0) return null; //行为同Java的PriorityQueue
        let { arr } = this;
        this.swap(1, arr.length - 1);// 末尾的换上来，堆顶放到最后等待返回
        let res = arr.pop();
        this.down(1);// 换上来的末尾尝试下沉
        return res;
    }

    /**
    * 返回优先级最高元素，但不出队
    */
    peek(): any {
        return this.arr[1];
    }
}
