import * as vscode from 'vscode';
import { extract } from '../../context-extractor/dist/main';

export function activate(context: vscode.ExtensionContext) {
	const holeTypeProvider = new HoleTypeProvider();
	const relevantTypesProvider = new RelevantTypesProvider();
	const relevantHeadersProvider = new RelevantHeadersProvider();

	vscode.window.registerTreeDataProvider('holeTypeView', holeTypeProvider);
	vscode.window.registerTreeDataProvider('relevantTypesView', relevantTypesProvider);
	vscode.window.registerTreeDataProvider('relevantHeadersView', relevantHeadersProvider);

	const disposable = vscode.commands.registerCommand('extension.showHoleInfo', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const sketchPath = document.uri.fsPath;
			try {
				const result = await extract(sketchPath);

				holeTypeProvider.updateData(result.hole);
				relevantTypesProvider.updateData(result.relevantTypes);
				relevantHeadersProvider.updateData(result.relevantHeaders);
			} catch (error) {
				if (error instanceof Error) {
					vscode.window.showErrorMessage(`Error extracting data: ${error.message}`);
				} else {
					vscode.window.showErrorMessage('An unknown error occurred');
				}
			}
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	});

	context.subscriptions.push(disposable);
}

class HoleTypeProvider implements vscode.TreeDataProvider<HoleInfoItem> {
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

class RelevantTypesProvider implements vscode.TreeDataProvider<HoleInfoItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

	private data: string[] = ['No data'];

	updateData(newData: string[]) {
		this.data = newData;
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HoleInfoItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
		if (!element) {
			return Promise.resolve(this.data.map(type => new RelevantTypeItem(type)));
		}
		return Promise.resolve([]);
	}
}

class RelevantHeadersProvider implements vscode.TreeDataProvider<HoleInfoItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

	private data: string[] = ['No data'];

	updateData(newData: string[]) {
		this.data = newData;
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HoleInfoItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
		if (!element) {
			return Promise.resolve(this.data.map(header => new RelevantHeaderItem(header)));
		}
		return Promise.resolve([]);
	}
}

class HoleInfoItem extends vscode.TreeItem {
	constructor(label: string) {
		super(label);
		this.tooltip = `${this.label}`;
		this.description = '';
	}
}

class HoleTypeItem extends HoleInfoItem {
	constructor(holeType: string) {
		super(holeType);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
		this.iconPath = new vscode.ThemeIcon('symbol-key');
	}
}

class RelevantTypeItem extends HoleInfoItem {
	constructor(type: string) {
		super(type);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
		this.iconPath = new vscode.ThemeIcon('symbol-interface');
	}
}

class RelevantHeaderItem extends HoleInfoItem {
	constructor(header: string) {
		super(header);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
		this.iconPath = new vscode.ThemeIcon('symbol-namespace');
	}
}

export function deactivate() { }
