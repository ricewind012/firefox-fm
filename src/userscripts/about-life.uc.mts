// ==UserScript==
// @name         about:life
// @description  A page for the apps.
// @author       me
// @include      main
// ==/UserScript==
import { Hotkeys, Utils } from "chrome://userchromejs/content/uc_api.sys.mjs";
import { PanelMultiView } from "resource:///modules/PanelMultiView.sys.mjs";

import type { App_t, ClickEvent } from "@utils/types";

declare global {
	const MozXULElement: {
		/**
		 * @see https://github.com/mozilla/gecko-dev/blob/master/toolkit/content/customElements.js#L528
		 */
		parseXULToFragment(str: string, entities?: string[]): DocumentFragment;
	};

	/**
	 * @see https://searchfox.org/mozilla-central/source/browser/base/content/browser.js#4672
	 */
	function switchToTabHavingURI(
		aURI: nsIURI | string,
		aOpenNew: boolean,
		aOpenParams?: object,
		aUserContextId?: string,
	): boolean;
}

const APP_LIST: App_t[] = ["fm"];
const PANEL_ID = "life-panel";

const registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
const chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(
	Ci.nsIChromeRegistry,
);
const fphs = Cc["@mozilla.org/network/protocol;1?name=file"].getService(
	Ci.nsIFileProtocolHandler,
);

function FindResources(app: App_t) {
	const url = `chrome://userchrome/content/firefox-fm/src/apps/${app}/page/index.html`;
	const uri = Services.io.newURI(url);
	const fileUri = chromeRegistry.convertChromeURL(uri);
	const file = fphs.getFileFromURLSpec(fileUri.spec).QueryInterface(Ci.nsIFile);

	return file.exists() && url;
}

function GenerateFreeCID() {
	let uuid = Components.ID(Services.uuid.generateUUID().toString());
	while (registrar.isCIDRegistered(uuid)) {
		uuid = Components.ID(Services.uuid.generateUUID().toString());
	}
	return uuid;
}

class CAboutLifeModule implements nsIAboutModule {
	m_pURI: nsIURI;
	m_strURL: string;

	constructor(app: App_t) {
		this.m_strURL = FindResources(app);
		this.m_pURI = Services.io.newURI(this.m_strURL);
	}

	get QueryInterface() {
		return ChromeUtils.generateQI(["nsIAboutModule"]);
	}

	newChannel(_uri, loadInfo: nsILoadInfo) {
		const ch = Services.io.newChannelFromURIWithLoadInfo(this.m_pURI, loadInfo);
		ch.owner = Services.scriptSecurityManager.getSystemPrincipal();
		return ch;
	}

	getURIFlags(_uri) {
		return (
			Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.IS_SECURE_CHROME_UI
		);
	}

	getChromeURI(_uri) {
		return this.m_pURI;
	}
}

for (const app of APP_LIST) {
	const aboutModule = new CAboutLifeModule(app);
	const aboutModuleFactory: nsIFactory = {
		createInstance(aIID) {
			return aboutModule.QueryInterface(aIID);
		},
		QueryInterface: ChromeUtils.generateQI(["nsIFactory"]),
	};
	registrar.registerFactory(
		GenerateFreeCID(),
		aboutModule.m_strURL,
		`@mozilla.org/network/protocol/about;1?what=life-${app}`,
		aboutModuleFactory,
	);
}

class CPanelView {
	m_elPanel: XULPopupElement;
	m_widget: WidgetDetails;

	static s_elPopupSet = document.getElementById("mainPopupSet");

	static CreatePanelMarkup(id: string, header: string, xul: string) {
		return `
			<panel id="${id}" class="panel-no-padding" type="arrow" orient="vertical">
				<box class="panel-header">
					<html:h1>
						<html:span>${header}</html:span>
					</html:h1>
				</box>
				<toolbarseparator></toolbarseparator>
				<vbox class="panel-subview-body">${xul}</vbox>
			</panel>
		`;
	}

	constructor(id: string, xul: string, widget: Omit<WidgetDetails, "id">) {
		CPanelView.s_elPopupSet.appendChild(MozXULElement.parseXULToFragment(xul));
		globalThis.widget = Utils.createWidget({
			...widget,
			id,
			callback: (ev: ClickEvent<XULPopupElement>) => this.OnClick(ev),
		});
		this.m_elPanel = document.getElementById(id) as XULPopupElement;
	}

	Hide(ev: ClickEvent<XULPopupElement>) {
		ev.target.removeAttribute("open");
	}

	Show(ev: ClickEvent<XULPopupElement>) {
		ev.target.setAttribute("open", "true");
		PanelMultiView.openPopup(this.m_elPanel, ev.target, {
			position: "bottomleft topleft",
			triggerEvent: ev,
		});
	}

	OnClick(ev: ClickEvent<XULPopupElement>) {
		ev.preventDefault();

		const { target } = ev;
		if (target.getAttribute("open") === "true") {
			return;
		}

		this.m_elPanel.addEventListener("popuphidden", this.Hide, { once: true });
		this.Show(ev);
	}
}

const strAppsMarkup = APP_LIST.map(
	(e) => `<button id="panel-life-button-${e}">${e}</button>`,
).join("");
const panel = new CPanelView(
	PANEL_ID,
	CPanelView.CreatePanelMarkup(PANEL_ID, "LiFE Info", strAppsMarkup),
	{
		type: "toolbarbutton",
		image: "chrome://browser/skin/window.svg",
	},
);

for (const app of APP_LIST) {
	const btn = document.getElementById(`panel-life-button-${app}`);
	btn.addEventListener("click", () => {
		globalThis.switchToTabHavingURI(`about:life-${app}`, true);
	});
}

const key = Hotkeys.define({
	id: "key_openLifePanel",
	modifiers: "ctrl alt",
	key: "S",
	command: (_wnd, ev) => panel.Show(ev),
});
await key.autoAttach();
