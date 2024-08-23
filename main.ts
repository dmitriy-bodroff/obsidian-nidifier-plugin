import { App, ButtonComponent, Modal, Notice, Plugin, TFile } from 'obsidian';
import { customAlphabet } from 'nanoid';
import { i18n } from 'lang/helpers';

export default class NidifierPlugin extends Plugin {

    async onload() {
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

        const ribbonIconEl = this.addRibbonIcon('dices', i18n('Add or remove the note identifier (NID)'), (evt: MouseEvent) => {
            const file = this.app.workspace.getActiveFile();
            if (file instanceof TFile && file.extension === "md") {
                this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                    if (frontmatter.nid === undefined) {
                        frontmatter.nid = nanoid();
                        new Notice(i18n('The note identifier (NID) has been added'));
                    } else {
                        new NidRemovalConfirmationModal(this.app, () => {
                            this.app.fileManager.processFrontMatter(file, (fm) => {
                                delete fm.nid;
                                new Notice(i18n('The note identifier (NID) has been removed'));
                            });
                        }).open();
                    }
                });
            }
        });
        ribbonIconEl.addClass('nidifier-plugin-ribbon-class');

        this.registerEvent(this.app.vault.on("create", (file) => {
            if (file instanceof TFile && file.extension === "md") {
                this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                    if (frontmatter.nid === undefined) {
                        frontmatter.nid = nanoid();
                        new Notice(i18n('The note identifier (NID) has been added'));
                    }
                });
            }
        }));
    }
}

export class NidRemovalConfirmationModal extends Modal {

    onConfirm: () => void;

    constructor(app: App, onConfirm: () => void) {
        super(app);
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
 
        this.setTitle(i18n("Do you really want to remove the note identifier (NID)?"));

        contentEl.createDiv({ cls: "nidifier-button-group-control" }, divEl => {
            new ButtonComponent(divEl)
                .setButtonText(i18n("Cancel"))
                .onClick(() => {
                    this.close();
                });

            new ButtonComponent(divEl)
                .setCta()
                .setButtonText(i18n("Remove"))
                .onClick(() => {
                    this.close();
                    this.onConfirm();
                });
        });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}