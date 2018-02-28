/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions
const ADD = 0b10101000; // adds regA and regB
const AND = 0b10110011; // bitwise& regA and regB
const DEC = 0b01111001; // decreases a register by 1
const DIV = 0b10101011; // divides regA by regB; return error if regB === 0
const HLT = 0b00000001; // Halt CPU
const INC = 0b01111000; // increases a register by 1

const LDI = 0b10011001; // LDI R,I(mmediate)

const MUL = 0b10101010; // multiply regA by regB

const PRN = 0b01000011; // prints numeric value in regA to the console

const SUB = 0b10101001; // subtracts regB from regA

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers

    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
    this.reg.IR = 0; // Instruction Register

    this.setupBranchTable();
  }

  /**
   * Sets up the branch table
   * this is used by the tick()
   */
  setupBranchTable() {
    let bt = {};

    bt[ADD] = this.ADD;
    bt[AND] = this.AND;
    bt[DEC] = this.DEC;
    bt[DIV] = this.DIV;
    bt[HLT] = this.HLT;
    bt[INC] = this.INC;
    bt[LDI] = this.LDI;
    bt[MUL] = this.MUL;
    bt[PRN] = this.PRN;
    bt[SUB] = this.SUB;

    this.branchTable = bt;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    const _this = this;

    this.clock = setInterval(() => {
      _this.tick();
    }, 1);
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case 'ADD':
        return (this.reg[regA] = this.reg[regA] + this.reg[regB]);
        break;

      case 'SUB':
        return (this.reg[regA] = this.reg[regA] - this.reg[regB]);
        break;

      case 'MUL':
        return (this.reg[regA] = this.reg[regA] * this.reg[regB]);
        break;

      case 'DIV':
        if (regB === 0) {
          return 'Error: Can not divide by 0';
        }
        return (this.reg[regA] = this.reg[regA] / this.reg[regB]);
        break;

      case 'INC':
        return (this.reg[regA] = this.reg[regA] + 1);
        break;

      case 'DEC':
        return (this.reg[regA] = this.reg[regA] - 1);
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR) from the current PC
    // !!! IMPLEMENT ME use te branchTable here
    this.reg.IR = this.ram.read(this.reg.PC);

    // Debugging output
    //console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);

    // Based on the value in the Instruction Register, locate the
    // appropriate hander in the branchTable
    // !!! IMPLEMENT ME
    let handler = this.branchTable[this.reg.IR];

    // Check that the handler is defined, halt if not (invalid
    // instruction)
    // !!! IMPLEMENT ME
    if (handler === undefined) {
      console.error('Unknown opcode ' + this.reg.IR);
      this.stopClock();
      return;
    }

    // Read operandA and operandB

    let operandA = this.ram.read(this.reg.PC + 1);
    let operandB = this.ram.read(this.reg.PC + 2);
    // We need to use call() so we can set the "this" value inside
    // the handler (otherwise it will be undefined in the handler)
    handler.call(this, operandA, operandB);

    // Increment the PC register to go to the next instruction
    // !!! IMPLEMENT ME
    // first bit in instruction + 1 (mask of with or shift 6)
    this.reg.PC += ((this.reg.IR >> 6) & 0b00000011) + 1;
    // then move it by that bitNum + 1
  }

  // INSTRUCTION HANDLER CODE:

  /**
   * HLT
   */
  HLT() {
    this.stopClock();
  }

  /**
   * LDI R,I
   */
  LDI(regNum, value) {
    // !!! IMPLEMENT ME
    this.reg[regNum] = value;
  }

  /**
   * MUL R,R
   */
  ADD(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('ADD', regA, regB);
  }
  SUB(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('SUB', regA, regB);
  }
  MUL(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('MUL', regA, regB);
  }
  DIV(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('DIV', regA, regB);
  }
  DEC(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('DEC', regA, regB);
  }
  MUL(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('MUL', regA, regB);
  }

  /**
   * PRN R
   */
  PRN(regA) {
    console.log(parseInt(this.reg[regA]));
  }

  SUB(regA, regB) {
    // !!! IMPLEMENT ME
  }
}

module.exports = CPU;
