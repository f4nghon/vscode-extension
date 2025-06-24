import * as path from 'path';
import * as cp from 'child_process';
import {
  LanguageClient,
  LanguageClientOptions,
  StreamInfo,
} from 'vscode-languageclient/node';
import * as vscode from 'vscode';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  // Path to your .jar LSP server
  const jarPath = context.asAbsolutePath(
  path.join('out', 'server', 'com.vogella.lsp.asciidoc.server2-0.0.1-SNAPSHOT-jar-with-dependencies.jar')  );

  // Spawn the Java process
  const serverOptions = () => {
    const childProcess = cp.spawn('java', ['-jar', jarPath]);

    const result: StreamInfo = {
      reader: childProcess.stdout,
      writer: childProcess.stdin,
    };
	childProcess.stderr.on('data', (chunk) => {
  		console.error('[LSP SERVER]', chunk.toString());
    });
	childProcess.stdout.on('data', (chunk) => {
  		console.log('[LSP SERVER]', chunk.toString());
    });
    return Promise.resolve(result);
  };
	const outputChannel = vscode.window.createOutputChannel("MyDSL Language Server");
  	const traceOutputChannel = vscode.window.createOutputChannel("MyDSL Trace");

  	// VS Code client settings
  	const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'ide' }],
    outputChannel,
    traceOutputChannel
  }

  // Create and start the client
  client = new LanguageClient(
    'myLspClient',
    'My LSP Client',
    serverOptions,
    clientOptions
  );

  await client.start();
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
