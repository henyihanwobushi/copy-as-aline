'use babel';

import CopyAsAlineView from './copy-as-aline-view';
import { CompositeDisposable } from 'atom';

export default {

  copyAsAlineView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.copyAsAlineView = new CopyAsAlineView(state.copyAsAlineViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.copyAsAlineView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-as-aline:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.copyAsAlineView.destroy();
  },

  serialize() {
    return {
      copyAsAlineViewState: this.copyAsAlineView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let cleaned = selection
        .replace(/\n/gi, ' ')
        .replace(/\r/gi, ' ')
        .replace(/\t/gi, ' ')
        .replace(/ +/gi, ' ')
      atom.clipboard.write(cleaned)
    }
  }
};
