import * as vscode from 'vscode';
import { HoleTypeProvider } from './providers/holeType';
import { RelevantTypesProvider } from './providers/relevantTypes';
import { RelevantHeadersProvider } from './providers/relevantHeaders';
import { registerShowHoleInfoCommand } from './command/showHoleInfo';

export function activate(context: vscode.ExtensionContext) {
	const holeTypeProvider = new HoleTypeProvider();
	const relevantTypesProvider = new RelevantTypesProvider();
	const relevantHeadersProvider = new RelevantHeadersProvider();

	vscode.window.registerTreeDataProvider('holeTypeView', holeTypeProvider);
	vscode.window.registerTreeDataProvider('relevantTypesView', relevantTypesProvider);
	vscode.window.registerTreeDataProvider('relevantHeadersView', relevantHeadersProvider);

	registerShowHoleInfoCommand(context, holeTypeProvider, relevantTypesProvider, relevantHeadersProvider);
}

export function deactivate() { }
