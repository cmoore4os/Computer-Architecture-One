/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

// General registers
const IM = 0b00000101;
const IS = 0b00000110;
const SP = 0b00000111;

// Flag values
const FL_EQ = 0b00000001; // regA = regB
const FL_GT = 0b00000010; // regA > regB
const FL_LT = 0b00000100; // regA < regB

const ADD = 0b10101000; // adds regA and regB
const AND = 0b10110011; // bitwise& regA and regB
const CALL = 0b01001000; // CALL R
const CMP = 0b10100000; //

const DEC = 0b01111001; // decreases a register by 1
const DIV = 0b10101011; // divides regA by regB; return error if regB === 0
const HLT = 0b00000001; // Halt CPU
const INC = 0b01111000; // increases a register by 1
const INT = 0b01001010; // Software interrupt R
const IRET = 0b00001011; // Return from interrupt

const JEQ = 0b01010001; // JEQ R
const JGT = 0b01010100; // JGT R
const JLT = 0b01010011; // JLT R
const JMP = 0b01010000; // JMP R
const JNE = 0b01010010; // JNE R

const LD = 0b10011000; // set regA with the value stored at the address stored in regB
const LDI = 0b10011001; // LDI R,I(mmediate)
const MOD = 0b10101100; // Remainder of regA divided by regB
const MUL = 0b10101010; // multiply regA by regB
const NOP = 0b00000000; // NOP no operation; do nothing
const NOT = 0b01110000; // NOT R

const OR = 0b10110001; // OR regA and regB
const POP = 0b01001100; // Pop register off the stack
const PRA = 0b01000010; // Print alpha char to regA to the console
const PRN = 0b01000011; // prints numeric value in regA to the console
const PUSH = 0b01001101; // Push a reg on to stack

const RET = 0b00001001; // Return from subroutine
const ST = 0b10011010; // Store regB in the address stored in regA
const SUB = 0b10101001; // subtracts regB from regA
const XOR = 0b10110010; // bitwise-XOR regA and regB
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
    bt[CALL] = this.CALL;
    bt[CMP] = this.CMP;

    bt[DEC] = this.DEC;
    bt[DIV] = this.DIV;
    bt[HLT] = this.HLT;
    bt[INC] = this.INC;
    bt[INT] = this.INT;
    bt[IRET] = this.IRET;

    bt[JEQ] = this.JEQ;
    bt[JGT] = this.JGT;
    bt[JLT] = this.JLT;
    bt[JMP] = this.JMP;
    bt[JNE] = this.JNE;

    bt[LD] = this.LD;
    bt[LDI] = this.LDI;
    bt[MOD] = this.MOD;
    bt[MUL] = this.MUL;
    bt[NOP] = this.NOP;
    bt[NOT] = this.NOT;

    bt[OR] = this.OR;
    bt[POP] = this.POP;
    bt[PRA] = this.PRA;
    bt[PRN] = this.PRN;
    bt[PUSH] = this.PUSH;

    bt[RET] = this.RET;
    bt[ST] = this.ST;
    bt[SUB] = this.SUB;
    bt[XOR] = this.XOR;

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
   * Set Flag
   */
  setFlag(flag, value) {
    if (value === true) {
      //Set the Flag
      this.reg.FL = this.reg.FL | flag;
    } else {
      // Clear the Flag to 0
      this.reg.FL = this.reg.FL & ~flag;
    }
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

  CALL(regA) {
    this._push(this.reg.PC + 2);
    return this.reg[regA];
  }
  CMP(regA, regB) {
    this.alu('CMP', regA, regB);
  }
  DEC(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('DEC', regA, regB);
  }

  DIV(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('DIV', regA, regB);
  }
  INC(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('INC', regA, regB);
  }
  JEQ(regA) {
    if ((this.reg.FL & FL_EQ) === 1) {
      return this.reg[regA];
    }
  }

  JGT(regA) {
    if ((this.reg.FL & FL_GT) === 2) {
      return this.reg[regA];
    }
  }

  JLT(regA) {
    if ((this.reg.FL & FL_LT) === 4) {
      return this.reg[regA];
    }
  }

  JMP(regA) {
    return this.reg[regA];
  }

  JNE(regA) {
    if ((this.reg.FL & FL_EQ) === 0) {
      return this.reg[regA];
    }
  }
  LD(regA, regB) {
    this.reg[regA] = this.ram.read(this.reg[regB]);
  }

  MOD(regA, regB) {
    this.alu('MOD', regA, regB);
  }
  MUL(regA, regB) {
    // !!! IMPLEMENT ME
    // Call the ALU
    this.alu('MUL', regA, regB);
  }
  NOT(regA) {
    this.alu('NOT', regA);
  }

  OR(regA, regB) {
    this.alu('OR', regA, regB);
  }

  POP(regA) {
    this.reg[regA] = this._pop();
  }

  PRA(regA) {
    const value = this.reg[regA];
    console.log(String.fromCharCode(value));
  }

  PRN(regA) {
    console.log(parseInt(this.reg[regA]));
  }
  PUSH(regA) {
    this._push(this.reg[regA]);
  }

  RET() {
    return this._pop();
  }

  ST(regA, regB) {
    const value = this.reg[regB];
    this.ram.write(this.reg[regA], value);
  }
  SUB(regA, regB) {
    this.alu('SUB', regA, regB);
  }

  XOR(regA, regB) {
    this.alu('XOR', regA, regB);
  }
}

module.exports = CPU;
