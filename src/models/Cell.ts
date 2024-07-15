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

   isEmpty() { //  перевіряємо є у комірці фігура чи ні
      return this.figure === null;
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
      return true   
   }

   isEmptyDiagonal(target: Cell): boolean{ //Перевірка на пусту діагональ, загальний метод для руху фігур
      return true
   }

   setFigure(figure: Figure) { // цей метод пишемо для методу moveFigure через кільцеву залежність Cell та Figure
      this.figure = figure;
      this.figure.cell = this;
   }

   moveFigure(target: Cell) {
      if(this.figure && this.figure?.canMove(target)) {
         this.figure.moveFigure(target)
         target.setFigure(this.figure);
         this.figure = null;
      }
   }
}