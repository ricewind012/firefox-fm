/**
 * File actions wrapper class, maybe for future prompt usage...
 */
export class FileActions {
	file: nsIFile;

	constructor(file: nsIFile) {
		this.file = file;
	}

	delete() {
		this.file.remove(false);
	}

	open() {
		this.file.launch();
	}
}
