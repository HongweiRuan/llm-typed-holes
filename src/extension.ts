import * as vscode from 'vscode';
import { extract } from '../../context-extractor/dist/main';

export function activate(context: vscode.ExtensionContext) {
	const provider = new HoleInfoProvider();
	vscode.window.registerTreeDataProvider('holeInfoView', provider);

	const disposable = vscode.commands.registerCommand('extension.showHoleInfo', async() => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const sketchPath = document.uri.fsPath;
			// console.log(sketchPath);
			try {
				// call extract
				const result = await extract(sketchPath);

				// console.log(result);

				const extractedData = {
					holeType: result.hole,
					relevantTypes: result.relevantTypes,
					relevantHeaders: result.relevantHeaders
				};

				// update provider data
				provider.updateData(extractedData);
			} catch (error) {
				if (error instanceof Error) {
					vscode.window.showErrorMessage(`Error extracting data: ${error.message}`);
				} else {
					vscode.window.showErrorMessage('An unknown error occurred');
				}
			}
		}
		else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	});

	context.subscriptions.push(disposable);
}


class HoleInfoProvider implements vscode.TreeDataProvider<HoleInfoItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

	private data: { holeType: string, relevantTypes: string[], relevantHeaders: string[] } = {
		holeType: 'No data',
		relevantTypes: ['No data'],
		relevantHeaders: ['No data']
	};

	updateData(newData: { holeType: string, relevantTypes: string[], relevantHeaders: string[] }) {
		
		// console.log(newData);

		this.data = newData;
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HoleInfoItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
		if (!element) {
			return Promise.resolve([
				new SectionItem('Hole Type', [new HoleTypeItem(this.data.holeType)]),
				new SectionItem('Relevant Types', this.data.relevantTypes.map(type => new RelevantTypeItem(type))),
				new SectionItem('Relevant Headers', this.data.relevantHeaders.map(header => new RelevantHeaderItem(header)))
			]);
			
		}
		if (element instanceof SectionItem) {
			return Promise.resolve(element.children);
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
		super(`Hole Type: ${holeType}`);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}

class RelevantTypeItem extends HoleInfoItem {
	constructor(type: string) {
		super(`Relevant Type: ${type}`);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}

class RelevantHeaderItem extends HoleInfoItem {
	constructor(header: string) {
		super(`Relevant Header: ${header}`);
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}

class SectionItem extends HoleInfoItem {
	children: HoleInfoItem[];

	constructor(label: string, children: HoleInfoItem[]) {
		super(label);
		this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
		this.children = children;
	}
}


export function deactivate() { }
