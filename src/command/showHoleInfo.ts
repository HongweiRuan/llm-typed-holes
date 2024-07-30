import * as vscode from 'vscode';
import { extract } from '../../../context-extractor/dist/main';
import { HoleTypeProvider } from '../providers/holeType';
import { RelevantTypesProvider } from '../providers/relevantTypes';
import { RelevantHeadersProvider } from '../providers/relevantHeaders';

export function registerShowHoleInfoCommand(context: vscode.ExtensionContext, holeTypeProvider: HoleTypeProvider, relevantTypesProvider: RelevantTypesProvider, relevantHeadersProvider: RelevantHeadersProvider) {
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
