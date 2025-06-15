// ==UserScript==
// @name         about:life
// @description  A page for the apps.
// @author       me
// @include      main
// ==/UserScript==
import { Hotkeys, Utils } from "chrome://userchromejs/content/uc_api.sys.mjs";

declare global {
	interface Window {
		/**
		 * @see https://searchfox.org/mozilla-central/source/browser/base/content/browser.js#4672
		 */
		switchToTabHavingURI(
			aURI: nsIURI,
			aOpenNew: boolean,
			aOpenParams?: object,
			aUserContextId?: string,
		): boolean;
	}
}

const registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
const chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(
	Ci.nsIChromeRegistry,
);
const fphs = Cc["@mozilla.org/network/protocol;1?name=file"].getService(
	Ci.nsIFileProtocolHandler,
);

/**
 * @todo "fm" only for now, but:
 * 1. use about:life as a start page using hashes ?
 * 2. do about:life-{fm,other-app,etc} ?
 */
function findResources(strAppName: string) {
	const url = `chrome://userchrome/content/firefox-fm/src/apps/${strAppName}/page/index.html`;
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

class CAboutLife {
	uri: nsIURI;
	urlString: string;

	static s_strAboutURL = "about:life";

	constructor() {
		this.urlString = findResources("fm");
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

const aboutLife = new CAboutLife();
const AboutModuleFactory: nsIFactory = {
	createInstance(aIID) {
		return aboutLife.QueryInterface(aIID);
	},
	QueryInterface: ChromeUtils.generateQI(["nsIFactory"]),
};
registrar.registerFactory(
	generateFreeCID(),
	CAboutLife.s_strAboutURL,
	"@mozilla.org/network/protocol/about;1?what=life",
	AboutModuleFactory,
);

function OpenLifeApps() {
	globalThis.switchToTabHavingURI(CAboutLife.s_strAboutURL, true);
}

Utils.createWidget({
	id: "open-life-apps-page",
	type: "toolbarbutton",
	image: "chrome://browser/skin/window.svg",
	label: "Open the apps page",
	callback: OpenLifeApps,
});

Hotkeys.define({
	id: "key_openAboutLife",
	modifiers: "accel alt",
	key: "S",
	command: OpenLifeApps,
});
