import { HoleInfoItem } from './holeInfo';
import * as vscode from 'vscode';

export class RelevantTypeItem extends HoleInfoItem {
  constructor(type: string) {
    super(type);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-interface');
  }
}