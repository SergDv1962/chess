import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure } from "./figure/Figure";

export class Cell {
   readonly x: number;
   readonly y: number;
   readonly color: Colors;
   figure: Figure | null;
   board: Board;  // кільцева(рекурсивна) залежність між класами Board та Cell, це не дуже добре но автор це прийняв
   available: boolean; // Можеш чи ні ходити на цю комірку
   id: number; //Для реакт ключів

   constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.figure = figure;
      this.board = board;
      this.available = false;
      this.id = Math.random();
   }

   isEmpty(): boolean { //  перевіряємо є у комірці фігура чи ні
      return this.figure === null;
   }
      //перевіряемо ворог чи ні 
   isEnemy(target: Cell): boolean {
      if (target.figure) {
         return this.figure?.color !== target.figure.color;
      }
      return false
   }

   isEmptyVertical(target: Cell): boolean{ //Перевірка на пусту вертікаль, загальний метод для руху фігур
      if(this.x !== target.x) {
         return false;
      }

      const min = Math.min(this.y, target.y);
      const max = Math.max(this.y, target.y);
      for (let y = min + 1; y < max; y++) {
         if(!this.board.getCell(this.x, y).isEmpty()) {
            return false
         }   
      }
      return true;
   }

   isEmptyHorizontal(target: Cell): boolean{ //Перевірка на пусту горізонталь, загальний метод для руху фігур
      if(this.y !== target.y) {
         return false;
      }

      const min = Math.min(this.x, target.x);
      const max = Math.max(this.x, target.x);
      for (let x = min + 1; x < max; x++) {
         if(!this.board.getCell(x, this.y).isEmpty()) {
            return false
         }   
      }
      return true   
   }

   isEmptyDiagonal(target: Cell): boolean{ //Перевірка на пусту діагональ, загальний метод для руху фігур
      const absX = Math.abs(target.x - this.x);
      const absY = Math.abs(target.y - this.y);
      if(absY !== absX)
         return false

      const dy = this.y < target.y ? 1 : -1
      const dx = this.x < target.x ? 1 : -1

      for (let i = 1; i < absY; i++) {
         if(!this.board.getCell(this.x + dx*i, this.y + dy*i).isEmpty())
            return false;
      }
      return true
   }

   setFigure(figure: Figure) { // цей метод пишемо для методу moveFigure через кільцеву залежність Cell та Figure
      this.figure = figure;
      this.figure.cell = this;
   }

   addLostFigure(figure: Figure) {
      figure.color === Colors.BLACK
         ? this.board.lostBlackFigurs.push(figure)
         : this.board.lostWhiteFigurs.push(figure)
   }

   moveFigure(target: Cell) {
      if(this.figure && this.figure?.canMove(target)) {
         this.figure.moveFigure(target)
         if (target.figure) {
            this.addLostFigure(target.figure);
         }
         target.setFigure(this.figure);
         this.figure = null;
      }
   }
}