/**
 * File actions wrapper class, maybe for future prompt usage...
 */
export class FileActions {
	constructor(file) {
		this.file = file;
	}

	delete() {
		this.file.remove(false);
	}

	open() {
		this.file.launch();
	}
}
