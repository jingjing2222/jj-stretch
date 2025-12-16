import * as vscode from "vscode";

export const isNyanCatEnabled = () => {
  const config = vscode.workspace.getConfiguration("jj-stretch");
  const nyancatEnabled = config.get<boolean>("nyancatEnabled", true);
  return nyancatEnabled;
};
