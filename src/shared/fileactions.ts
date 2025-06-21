/**
 * File actions wrapper class, maybe for future prompt usage...
 */
export class CFileActions {
	m_pFile: nsIFile;

	constructor(file: nsIFile) {
		this.m_pFile = file;
	}

	Delete() {
		this.m_pFile.remove(false);
	}

	Open() {
		this.m_pFile.launch();
	}
}
