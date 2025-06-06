// ==UserScript==
// @name         about:file-manager
// @description  A page for the file manager.
// @author       me
// @include      main
// ==/UserScript==

// TODO: ts rewrite

import { Hotkeys, Utils } from "chrome://userchromejs/content/uc_api.sys.mjs";

const registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
const chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(
	Ci.nsIChromeRegistry
);
const fphs = Cc["@mozilla.org/network/protocol;1?name=file"].getService(
	Ci.nsIFileProtocolHandler
);

function findResources() {
	const url = "chrome://userchrome/content/firefox-fm/src/page/fm.html";
	const uri = Services.io.newURI(url);
	const fileUri = chromeRegistry.convertChromeURL(uri);
	const file = fphs.getFileFromURLSpec(fileUri.spec).QueryInterface(Ci.nsIFile);

	return file.exists() && url;
}

function generateFreeCID() {
	let uuid = Components.ID(Services.uuid.generateUUID().toString());
	while (registrar.isCIDRegistered(uuid)) {
		uuid = Components.ID(Services.uuid.generateUUID().toString());
	}
	return uuid;
}

class AboutFM {
	static ABOUT_URL = "about:fm";

	constructor() {
		this.urlString = findResources();
		this.uri = Services.io.newURI(this.urlString);
	}

	get QueryInterface() {
		return ChromeUtils.generateQI(["nsIAboutModule"]);
	}

	newChannel(_uri, loadInfo) {
		const ch = Services.io.newChannelFromURIWithLoadInfo(this.uri, loadInfo);
		ch.owner = Services.scriptSecurityManager.getSystemPrincipal();
		return ch;
	}

	getURIFlags(_uri) {
		return (
			Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.IS_SECURE_CHROME_UI
		);
	}

	getChromeURI(_uri) {
		return this.uri;
	}
}

const aboutFm = new AboutFM();
/** @type nsIFactory */
const AboutModuleFactory = {
	createInstance(aIID) {
		return aboutFm.QueryInterface(aIID);
	},
	QueryInterface: ChromeUtils.generateQI(["nsIFactory"]),
};
if (aboutFm.urlString) {
	registrar.registerFactory(
		generateFreeCID(),
		AboutFM.ABOUT_URL,
		"@mozilla.org/network/protocol/about;1?what=fm",
		AboutModuleFactory
	);
}

const openFm = () => switchToTabHavingURI(AboutFM.ABOUT_URL, true);

Utils.createWidget({
	id: "open-fm",
	type: "toolbarbutton",
	image: "chrome://browser/skin/window.svg",
	label: "Open FM",
	callback: openFm,
});

Hotkeys.define({
	id: "key_openAboutFM",
	modifiers: "accel alt",
	key: "S",
	command: openFm,
});
