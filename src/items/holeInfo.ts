import * as vscode from 'vscode';

export class HoleInfoItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label);
    this.tooltip = `${this.label}`;
    this.description = '';
  }
}
