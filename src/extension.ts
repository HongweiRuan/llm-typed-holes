import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const provider = new HoleInfoProvider();
	vscode.window.registerTreeDataProvider('holeInfoView', provider);

	const disposable = vscode.commands.registerCommand('extension.showHoleInfo', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position = editor.selection.active;
			const document = editor.document;
			const wordRange = document.getWordRangeAtPosition(position);
			const word = wordRange ? document.getText(wordRange) : '';

			// Simulate static analysis and update the provider with new data
			// TODO: make it an async function, fetch actual data
			const fakeData = getFakeDataBasedOnWord(word);

			// TODO: update actual data
			provider.updateData(fakeData);
		}
	});

	context.subscriptions.push(disposable);
}

function getFakeDataBasedOnWord(word: string) {
	if (word === 'example') {
		return {
			holeType: '',
			relevantTypes: [],
			relevantHeaders: []
		};
	} else {
		return {
			holeType: 'Unknown Type',
			relevantTypes: [],
			relevantHeaders: []
		};
	}
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
		super(`Hole Type: ${holeType}`)
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}

class RelevantTypeItem extends HoleInfoItem {
	constructor(type: string) {
		super(`Relevant Type: ${type}`)
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}

class RelevantHeaderItem extends HoleInfoItem {
	constructor(header: string) {
		super(`Relevant Header: ${header}`)
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
