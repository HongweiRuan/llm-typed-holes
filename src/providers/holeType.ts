import * as vscode from 'vscode';
import { HoleTypeItem } from '../items/holeType';
import { HoleInfoItem } from '../items/holeInfo';

export class HoleTypeProvider implements vscode.TreeDataProvider<HoleInfoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: string = 'No data';

  updateData(newData: string) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      return Promise.resolve([new HoleTypeItem(this.data)]);
    }
    return Promise.resolve([]);
  }
}
