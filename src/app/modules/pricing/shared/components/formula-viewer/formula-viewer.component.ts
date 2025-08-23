import {Component, Input, OnInit} from '@angular/core';

interface FormulaNode {
  type: 'block' | 'operator' | 'text' | 'or';
  content: string;
  children?: FormulaNode[];
}

@Component({
  selector: 'app-formula-viewer',
  templateUrl: './formula-viewer.component.html',
  styleUrls: ['./formula-viewer.component.scss']
})
export class FormulaViewerComponent implements OnInit {
  @Input() formula: string = '';
  parsedFormula: FormulaNode[] = [];

  ngOnInit(): void {
    this.parsedFormula = this.parseFormula(this.formula);
  }

  private parseFormula(formula: string): FormulaNode[] {
    const nodes: FormulaNode[] = [];
    let currentText = '';
    let stack: FormulaNode[] = [];
    let currentBlock: FormulaNode | null = null;

    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];

      switch (char) {
        case '[':
          if (currentText.trim()) {
            if (currentBlock) {
              currentBlock.children?.push({ type: 'text', content: currentText.trim() });
            } else {
              nodes.push({ type: 'text', content: currentText.trim() });
            }
            currentText = '';
          }
          const newBlock: FormulaNode = { type: 'block', content: '', children: [] };
          if (currentBlock) {
            stack.push(currentBlock);
            currentBlock.children?.push(newBlock);
          } else {
            nodes.push(newBlock);
          }
          currentBlock = newBlock;
          break;

        case ']':
          if (currentText.trim()) {
            currentBlock?.children?.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          currentBlock = stack.pop() || null;
          break;

        case '+':
        case '-':
        case '*':
        case '/':
          if (currentText.trim()) {
            if (currentBlock) {
              currentBlock.children?.push({ type: 'text', content: currentText.trim() });
            } else {
              nodes.push({ type: 'text', content: currentText.trim() });
            }
            currentText = '';
          }
          if (currentBlock) {
            currentBlock.children?.push({ type: 'operator', content: char });
          } else {
            nodes.push({ type: 'operator', content: char });
          }
          break;

        case '|':
          if (i + 1 < formula.length && formula[i + 1] === '|') {
            if (currentText.trim()) {
              if (currentBlock) {
                currentBlock.children?.push({ type: 'text', content: currentText.trim() });
              } else {
                nodes.push({ type: 'text', content: currentText.trim() });
              }
              currentText = '';
            }
            if (currentBlock) {
              currentBlock.children?.push({ type: 'or', content: 'OU' });
            } else {
              nodes.push({ type: 'or', content: 'OU' });
            }
            i++; // Skip next |
          } else {
            currentText += char;
          }
          break;

        default:
          currentText += char;
      }
    }

    if (currentText.trim()) {
      if (currentBlock) {
        currentBlock.children?.push({ type: 'text', content: currentText.trim() });
      } else {
        nodes.push({ type: 'text', content: currentText.trim() });
      }
    }

    return nodes;
  }
}
