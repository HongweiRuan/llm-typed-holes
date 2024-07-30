import { HoleInfoItem } from './holeInfo';
import * as vscode from 'vscode';

export class HoleTypeItem extends HoleInfoItem {
  constructor(holeType: string) {
    super(holeType);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-key');
  }
}
