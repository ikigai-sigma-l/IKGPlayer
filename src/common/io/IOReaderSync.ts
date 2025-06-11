/**
 * 读字节流工具
 */

import * as logger from '../util/logger'
import IOWriter from './IOWriterSync'
import * as text from '../util/text'
import { Uint8ArrayInterface, BytesReaderSync } from './interface'
import { IOError } from './error'

export default class IOReaderSync implements BytesReaderSync {

  private data: DataView

  private buffer: Uint8ArrayInterface

  private pointer: number

  private endPointer: number

  private pos: bigint

  private size: number

  private littleEndian: boolean

  private fileSize_: bigint

  public error: number

  public onFlush: (buffer: Uint8Array) => number

  public onSeek: (seek: bigint) => number

  public onSize: () => bigint

  public flags: number

  /**
   * @param data 待读取的字节
   * @param bigEndian 是否按大端字节序读取，默认大端字节序（网络字节序）
   */
  constructor(size: number = 1 * 1024 * 1024, bigEndian: boolean = true, map?: Uint8ArrayInterface) {
    this.pos = 0n
    this.pointer = 0
    this.error = 0

    this.endPointer = 0
    this.littleEndian = !bigEndian
    this.flags = 0

    if (map && map.view) {
      this.size = map.length
      this.buffer = map
      this.data = map.view
    }
    else if (map && !map.byteOffset) {
      this.size = map.length
      this.buffer = map
      this.data = new DataView(this.buffer.buffer)
    }
    else {

      if (map) {
        throw new Error('not support subarray of ArrayBuffer')
      }

      this.size = Math.max(size, 100 * 1024)
      this.buffer = new Uint8Array(this.size)
      this.data = new DataView(this.buffer.buffer)
    }
  }

  /**
   * 读取 8 位无符号整数
   * 
   * @returns 
   */
  public readUint8() {
    if (this.remainingLength() < 1) {
      this.flush(1)
    }
    const value = this.data.getUint8(this.pointer)
    this.pointer++
    this.pos++
    return value
  }
  /**
   * 读取 8 位无符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekUint8() {
    if (this.remainingLength() < 1) {
      this.flush(1)
    }
    return this.data.getUint8(this.pointer)
  }

  /**
   * 读取 16 位无符号整数
   * 
   * @returns 
   */
  public readUint16() {
    if (this.remainingLength() < 2) {
      this.flush(2)
    }
    const value = this.data.getUint16(this.pointer, this.littleEndian)
    this.pointer += 2
    this.pos += 2n
    return value
  }
  /**
   * 读取 16 位无符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekUint16() {
    if (this.remainingLength() < 2) {
      this.flush(2)
    }
    return this.data.getUint16(this.pointer, this.littleEndian)
  }

  /**
   * 读取 24 位无符号整数
   * 
   * @returns 
   */
  public readUint24() {
    if (this.remainingLength() < 3) {
      this.flush(3)
    }
    const high = this.readUint16()
    const low = this.readUint8()
    return this.littleEndian ? (low << 16 | high) : (high << 8 | low)
  }
  /**
   * 读取 24 位无符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekUint24() {
    if (this.remainingLength() < 3) {
      this.flush(3)
    }
    const pointer = this.pointer
    const pos = this.pos

    const high = this.readUint16()
    const low = this.readUint8()
    const value = this.littleEndian ? (low << 16 | high) : (high << 8 | low)

    this.pointer = pointer
    this.pos = pos

    return value
  }

  /**
   * 读取 32 位无符号整数
   * 
   * @returns 
   */
  public readUint32() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    const value = this.data.getUint32(this.pointer, this.littleEndian)
    this.pointer += 4
    this.pos += 4n
    return value
  }
  /**
   * 读取 32 位无符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekUint32() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    return this.data.getUint32(this.pointer, this.littleEndian)
  }

  /**
   * 读取 64 位无符号整数
   * 
   * @returns 
   */
  public readUint64() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    const value = this.data.getBigUint64(this.pointer, this.littleEndian)
    this.pointer += 8
    this.pos += 8n
    return value
  }
  /**
   * 读取 64 位无符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekUint64() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    return this.data.getBigUint64(this.pointer, this.littleEndian)
  }

  /**
   * 读取 8 位有符号整数
   * 
   * @returns 
   */
  public readInt8() {
    if (this.remainingLength() < 1) {
      this.flush(1)
    }
    const value = this.data.getInt8(this.pointer)
    this.pointer++
    this.pos++
    return value
  }
  /**
   * 读取 8 位有符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekInt8() {
    if (this.remainingLength() < 1) {
      this.flush(1)
    }
    return this.data.getInt8(this.pointer)
  }

  /**
   * 读取 16 位有符号整数
   * 
   * @returns 
   */
  public readInt16() {
    if (this.remainingLength() < 2) {
      this.flush(2)
    }
    const value = this.data.getInt16(this.pointer, this.littleEndian)
    this.pointer += 2
    this.pos += 2n
    return value
  }
  /**
   * 读取 16 位有符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekInt16() {
    if (this.remainingLength() < 2) {
      this.flush(2)
    }
    return this.data.getInt16(this.pointer, this.littleEndian)
  }

  /**
   * 读取 24 位有符号整数
   * 
   * @returns 
   */
  public readInt24() {
    const value = this.readUint24()
    return (value & 0x800000) ? (value - 0x1000000) : value
  }
  /**
   * 读取 24 位有符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekInt24() {
    const value = this.peekUint24()
    return (value & 0x800000) ? (value - 0x1000000) : value
  }

  /**
   * 读取 32 位有符号整数
   * 
   * @returns 
   */
  public readInt32() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    const value = this.data.getInt32(this.pointer, this.littleEndian)
    this.pointer += 4
    this.pos += 4n
    return value
  }
  /**
   * 读取 32 位有符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekInt32() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    return this.data.getInt32(this.pointer, this.littleEndian)
  }

  /**
   * 读取 64 位有符号整数
   * 
   * @returns 
   */
  public readInt64() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    const value = this.data.getBigInt64(this.pointer, this.littleEndian)
    this.pointer += 8
    this.pos += 8n
    return value
  }
  /**
   * 读取 64 位有符号整数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekInt64() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    return this.data.getBigInt64(this.pointer, this.littleEndian)
  }

  /**
   * 读取单精度浮点数
   * 
   * @returns 
   */
  public readFloat() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    const value = this.data.getFloat32(this.pointer, this.littleEndian)
    this.pointer += 4
    this.pos += 4n
    return value
  }
  /**
   * 读取单精度浮点数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekFloat() {
    if (this.remainingLength() < 4) {
      this.flush(4)
    }
    return this.data.getFloat32(this.pointer, this.littleEndian)
  }

  /**
   * 读取双精度浮点数
   * 
   * @returns 
   */
  public readDouble() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    const value = this.data.getFloat64(this.pointer, this.littleEndian)
    this.pointer += 8
    this.pos += 8n
    return value
  }
  /**
   * 读取双精度浮点数（不会移动读取指针位置）
   * 
   * @returns 
   */
  public peekDouble() {
    if (this.remainingLength() < 8) {
      this.flush(8)
    }
    return this.data.getFloat64(this.pointer, this.littleEndian)
  }

  /**
   * 读取指定长度的字节，并以 16 进制字符串返回
   * 
   * @param length 默认 1
   * @returns 
   */
  public readHex(length: number = 1) {
    let hexStr = ''
    for (let i = 0; i < length; i++) {
      const hex = this.readUint8().toString(16)
      hexStr += (hex.length === 1 ? '0' + hex : hex)
    }
    return hexStr
  }
  /**
   * 读取指定长度的字节，并以 16 进制字符串返回（不会移动读取指针位置）
   * 
   * @param length 默认 1
   * @returns 
   */
  public peekHex(length: number = 1) {

    if (length > this.size) {
      this.error = IOError.INVALID_OPERATION
      logger.fatal('peekHex, length too large')
    }

    if (this.remainingLength() < length) {
      this.flush(length)
    }

    const pointer = this.pointer
    const pos = this.pos

    let hexStr = ''
    for (let i = 0; i < length; i++) {
      const hex = this.readUint8().toString(16)
      hexStr += (hex.length === 1 ? '0' + hex : hex)
    }

    this.pointer = pointer
    this.pos = pos

    return hexStr
  }

  /**
   * 读取指定长度的二进制数据，不够抛错
   * 
   * 第二个参数可传入预先分配的 buffer
   * 
   * 返回读取的 Uint8Array
   * 
   * @param length 
   * @returns 
   */
  public readBuffer(length: number): Uint8Array
  public readBuffer<T extends Uint8ArrayInterface>(length: number, buffer: T): T
  public readBuffer(length: number, buffer?: Uint8ArrayInterface): Uint8ArrayInterface {

    if (!length) {
      return new Uint8Array(0)
    }

    if (!buffer) {
      buffer = new Uint8Array(length)
    }

    if (this.remainingLength() < length) {
      let index = 0

      if (this.remainingLength() > 0) {
        const len = this.remainingLength()
        buffer.set(this.buffer.subarray(this.pointer, this.pointer + len), index)
        index += len
        this.pointer += len
        this.pos += BigInt(len)
        length -= len
      }

      while (length > 0) {
        this.flush()

        const len = Math.min(this.endPointer - this.pointer, length)

        buffer.set(this.buffer.subarray(this.pointer, this.pointer + len), index)

        index += len
        this.pointer += len
        this.pos += BigInt(len)
        length -= len
      }
    }
    else {
      buffer.set(this.buffer.subarray(this.pointer, this.pointer + length), 0)
      this.pointer += length
      this.pos += BigInt(length)
    }

    return buffer
  }
  /**
   * 读取指定长度的二进制 buffer 数据（不会移动读取指针位置）
   * 
   * @param length 
   * @returns 
   */
  public peekBuffer(length: number): Uint8Array
  public peekBuffer<T extends Uint8ArrayInterface>(length: number, buffer: T): T
  public peekBuffer(length: number, buffer?: Uint8ArrayInterface): Uint8ArrayInterface {

    if (!length) {
      return new Uint8Array(0)
    }

    if (length > this.size) {
      this.error = IOError.INVALID_OPERATION
      logger.fatal('peekBuffer, length too large')
    }

    if (this.remainingLength() < length) {
      this.flush(length)
    }

    if (!buffer) {
      buffer = new Uint8Array(length)
    }

    buffer.set(this.buffer.subarray(this.pointer, this.pointer + length), 0)

    return buffer
  }

  /**
   * 读取最多 length 字节的数据到指定 buffer，返回已写入的字节长度
   * 
   * @param length 
   * @param buffer 
   * @returns 
   */
  public readToBuffer(length: number, buffer: Uint8ArrayInterface): number {
    if (this.remainingLength() < length) {
      let index = 0

      if (this.remainingLength() > 0) {
        const len = this.remainingLength()
        buffer.set(this.buffer.subarray(this.pointer, this.pointer + len), index)
        index += len
        this.pointer += len
        this.pos += BigInt(len)
        length -= len
      }

      while (length > 0) {
        try {
          this.flush()
        }
        catch (error) {
          if (this.error === IOError.END && index) {
            return index
          }
          else {
            throw error
          }
        }

        const len = Math.min(this.endPointer - this.pointer, length)

        buffer.set(this.buffer.subarray(this.pointer, this.pointer + len), index)

        index += len
        this.pointer += len
        this.pos += BigInt(len)
        length -= len
      }
      return index
    }
    else {
      buffer.set(this.buffer.subarray(this.pointer, this.pointer + length), 0)
      this.pointer += length
      this.pos += BigInt(length)
      return length
    }
  }

  /**
   * 读取指定长度的字符串
   * 
   * @param length 默认 1
   * @returns 
   */
  public readString(length: number = 1) {
    const buffer = this.readBuffer(length)
    return text.decode(buffer)
  }
  /**
   * 读取指定长度的字符串
   * 
   * @param length 默认 1
   * @returns 
   */
  public peekString(length: number = 1) {
    const buffer = this.peekBuffer(length)
    return text.decode(buffer)
  }

  /**
   * 读取一行字符
   */
  public readLine() {
    let str = ''

    while (true) {
      let got = false
      for (let i = this.pointer; i < this.endPointer; i++) {
        if (this.buffer[i] === 0x0a || this.buffer[i] === 0x0d) {
          if (i !== this.pointer) {
            str += this.readString(i - this.pointer)
          }
          got = true
          break
        }
      }

      if (!got) {
        str += this.readString(this.remainingLength())
        this.flush()
      }
      else {
        break
      }
    }

    let next = this.peekUint8()
    if (next === 0x0a || next === 0x0d) {
      this.pointer++
      if (next === 0x0d) {
        next = this.peekUint8()
        // \r\n
        if (next === 0x0a) {
          this.pointer++
        }
      }
    }

    return str
  }
  /**
   * 读取一行字符
   */
  public peekLine() {
    if (this.remainingLength() < this.size) {
      this.flush()
    }

    let str = ''

    let got = false
    for (let i = this.pointer; i < this.endPointer; i++) {
      if (this.buffer[i] === 0x0a || this.buffer[i] === 0x0d) {
        str += this.peekString(i - this.pointer)
        got = true
        break
      }
    }

    if (!got) {
      this.error = IOError.INVALID_OPERATION
      logger.fatal('peekLine, out of buffer')
    }
    return str
  }

  /**
   * 获取当前读取指针
   * 
   * @returns 
   */
  public getPointer() {
    return this.pointer
  }

  /**
   * 获取已读字节偏移
   * 
   * @returns 
   */
  public getPos() {
    return this.pos
  }

  /**
   * 跳过指定字节长度
   * 
   * @param length 
   */
  public skip(length: number) {

    const backup = length

    while (this.remainingLength() < length) {
      length -= this.remainingLength()
      this.pointer = this.endPointer
      this.flush()
    }

    if (this.remainingLength() >= length) {
      this.pointer += length
    }

    this.pos += BigInt(backup)
  }

  /**
   * 获取剩余可读字节数
   * 
   * @returns 
   */
  public remainingLength() {
    return this.endPointer - this.pointer
  }

  /**
   * 重新填充剩余缓冲区
   * 
   * @param need 
   * @returns 
   */
  public flush(need: number = 0) {

    if (!this.onFlush) {
      this.error = IOError.INVALID_OPERATION
      logger.fatal('IOReader error, flush failed because of no flush callback')
    }

    if (this.size - this.remainingLength() <= 0) {
      return
    }

    need = Math.min(need, this.size)

    if (this.pointer < this.endPointer) {
      this.buffer.set(this.buffer.subarray(this.pointer, this.endPointer), 0)
      this.endPointer = this.endPointer - this.pointer
    }
    else {
      this.endPointer = 0
    }
    this.pointer = 0

    if (need) {
      while (this.remainingLength() < need) {
        const len = this.onFlush(this.buffer.subarray(this.endPointer))
        if (len < 0) {
          this.error = len
          throw new Error(`IOReader error, flush ${len === IOError.END ? 'ended' : 'failed'}, ret: ${len}`)
        }
        this.endPointer += len
      }
    }
    else {
      const len = this.onFlush(this.buffer.subarray(this.endPointer))
      if (len < 0) {
        this.error = len
        throw new Error(`IOReader error, flush ${len === IOError.END ? 'ended' : 'failed'}, ret: ${len}`)
      }
      this.endPointer += len
    }
    this.error = 0
  }

  /**
   * 
   * seek 到指定位置
   * 
   * @param pos 
   * @param force false 时可以在目前的缓冲区内 seek，否则丢弃缓冲区内容重新填充指定位置的数据，默认 false
   * @param flush 指定 seek 之后是否马上填充数据，否则只 seek 到目标位置，默认 true
   * @returns 
   */
  public seek(pos: bigint, force: boolean = false, flush: boolean = true) {
    if (!force) {
      const len = Number(pos - this.pos)
      // 可以往回 seek
      if (len < 0 && Math.abs(len) < this.pointer) {
        this.pointer += len
        this.pos = pos
        return
      }
      // 可以直接往后 seek
      else if (len > 0 && this.pointer + len < this.endPointer) {
        this.pointer += len
        this.pos = pos
        return
      }
      else if (len === 0) {
        return
      }
    }

    if (!this.onSeek) {
      this.error = IOError.INVALID_OPERATION
      logger.fatal('IOReader error, seek failed because of no seek callback')
    }

    this.pointer = this.endPointer = 0
    this.pos = pos
    const ret = this.onSeek(pos)

    if (ret !== 0) {
      this.error = ret
      logger.fatal('IOReader error, seek failed')
    }

    if (flush) {
      this.flush()
    }
  }

  /**
   * 获取缓冲区
   */
  public getBuffer() {
    return this.buffer
  }

  /**
   * 写入数据到缓冲区
   * 
   * @param buffer 
   */
  public appendBuffer(buffer: Uint8ArrayInterface) {
    if (this.size - this.endPointer >= buffer.length) {
      this.buffer.set(buffer, this.endPointer)
      this.endPointer += buffer.length
    }
    else {
      this.buffer.set(this.buffer.subarray(this.pointer, this.endPointer), 0)
      this.endPointer = this.endPointer - this.pointer
      this.pointer = 0

      if (this.size - this.endPointer >= buffer.length) {
        this.buffer.set(buffer, this.endPointer)
        this.endPointer += buffer.length
      }
      else {
        const len = Math.min(this.size - this.endPointer, buffer.length)
        this.buffer.set(buffer.subarray(0, len), this.endPointer)
        this.endPointer += len

        logger.warn('IOReader, call appendBuffer but the buffer\'s size is lagger then the remaining size')
      }
    }
  }

  /**
   * 重置 reader
   */
  public reset() {
    this.pointer = this.endPointer = 0
    this.pos = 0n
    this.error = 0
  }

  /**
   * 设置读取是小端还是大端
   * 
   * @param bigEndian 
   */
  public setEndian(bigEndian: boolean) {
    this.littleEndian = !bigEndian
  }

  /**
   * 获取源总字节长度
   * 
   * @returns 
   */
  public fileSize() {
    if (this.fileSize_) {
      return this.fileSize_
    }
    if (!this.onSize) {
      logger.warn('IOReader error, fileSize failed because of no onSize callback')
      return 0n
    }
    try {
      this.fileSize_ = this.onSize()
    }
    catch (error) {
      logger.warn(`IOReader error, call fileSize failed: ${error}`)
      this.fileSize_ = 0n
    }
    return this.fileSize_
  }

  /**
   * 获取缓冲区长度
   * 
   * @returns 
   */
  public getBufferSize() {
    return this.size
  }

  /**
   * 连接到 ioWriter
   * 
   * @param ioWriter 
   * @param length 
   */
  public pipe(ioWriter: IOWriter, length?: number) {
    if (length) {
      if (this.remainingLength() < length) {
        if (this.remainingLength() > 0) {
          const len = this.remainingLength()
          ioWriter.writeBuffer(this.buffer.subarray(this.pointer, this.pointer + len))
          this.pointer += len
          this.pos += BigInt(len)
          length -= len
        }

        while (length > 0) {
          this.flush()
          const len = Math.min(this.endPointer - this.pointer, length)
          ioWriter.writeBuffer(this.buffer.subarray(this.pointer, this.pointer + len))
          this.pointer += len
          this.pos += BigInt(len)
          length -= len
        }
      }
      else {
        ioWriter.writeBuffer(this.buffer.subarray(this.pointer, this.pointer + length))
        this.pointer += length
        this.pos += BigInt(length)
      }
    }
    else {
      if (this.remainingLength() > 0) {
        const len = this.remainingLength()
        ioWriter.writeBuffer(this.buffer.subarray(this.pointer, this.pointer + len))
        this.pointer += len
        this.pos += BigInt(len)
      }

      while (this.onFlush(this.buffer.subarray(0)) > 0) {
        const len = this.remainingLength()
        ioWriter.writeBuffer(this.buffer.subarray(this.pointer, this.pointer + len))
        this.pointer += len
        this.pos += BigInt(len)
      }
    }
  }
}
