/**
 * 静态分配区只能在此文件分配
 * 导出在其他地方使用
 */

import { SELF } from 'common/util/constant'
import * as config from './config'
import { Mutex } from './thread/mutex'

/**
 * 静态分配区栈顶指针
 */
let pointer: pointer<void> = reinterpret_cast<pointer<void>>(reinterpret_cast<pointer<pointer<void>>>(nullptr) + 1)

export function malloc(length: size, algin: size = 1): pointer<void> {

  let address = pointer

  while (address % algin) {
    address++
  }

  assert(address < config.HEAP_OFFSET, 'static data overflow')

  pointer = reinterpret_cast<pointer<void>>(address + length)

  return address
}

/**
 * 线程计数器地址
 */
export const threadCounter: pointer<uint32> = SELF.CHeap?.threadCounter
  ? SELF.CHeap.threadCounter
  : reinterpret_cast<pointer<uint32>>(malloc(sizeof(uint32), sizeof(uint32)))

/**
 * 堆分配锁地址
 */
export const heapMutex: pointer<Mutex> = SELF.CHeap?.heapMutex
  ? SELF.CHeap.heapMutex
  : reinterpret_cast<pointer<Mutex>>(malloc(sizeof(Mutex), sizeof(atomic_int32)))
