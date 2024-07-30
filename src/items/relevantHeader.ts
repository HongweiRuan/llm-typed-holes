import { HoleInfoItem } from './holeInfo';
import * as vscode from 'vscode';

export class RelevantHeaderItem extends HoleInfoItem {
  constructor(header: string) {
    super(header);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-namespace');
  }
}
