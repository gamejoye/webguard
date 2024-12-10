class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // 在链表末尾添加元素
  push(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  // 从链表开头移除并返回元素
  shift(): T | null {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.size--;

    if (this.size === 0) {
      this.tail = null;
    }

    return value;
  }

  // 从链表末尾移除并返回元素
  pop(): T | null {
    if (!this.head) {
      return null;
    }

    if (this.size === 1) {
      const value = this.head.value;
      this.head = null;
      this.tail = null;
      this.size = 0;
      return value;
    }

    let current = this.head;
    while (current.next !== this.tail) {
      current = current.next!;
    }

    const value = this.tail!.value;
    current.next = null;
    this.tail = current;
    this.size--;

    return value;
  }

  // 将链表转换为数组
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  // 获取链表长度
  getSize(): number {
    return this.size;
  }
}