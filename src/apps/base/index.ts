import { BASE_URL } from "@/shared/consts";
import { CLogger } from "@/utils/log";
import type { App_t } from "@/utils/types";

interface AppInfo {
	/**
	 * Document title.
	 */
	strTitle: string;

	/**
	 * List of CSS files to use, relative to `src/apps/${app}/components`.
	 */
	vecStyles: string[];
}

const INFO: Record<App_t, AppInfo> = {
	fm: {
		strTitle: "File Manager",
		vecStyles: ["content", "sidebar", "tabs/settings", "tabs/dir"],
	},
};

function AppendCSSLink(href: string) {
	const link = document.createElement("link");
	link.href = href;
	link.rel = "stylesheet";

	document.head.appendChild(link);
}

function AppendStyles() {
	const { strTitle, vecStyles } = INFO[app];

	document.title = strTitle;
	AppendCSSLink(`${BASE_URL}/src/apps/${app}/page/index.css`);
	for (const style of vecStyles) {
		// Each part has its own CSS file, the rest goes in index.css
		const href = `${BASE_URL}/src/apps/${app}/components/${style}.css`;
		AppendCSSLink(href);
	}
}

const logger = new CLogger(import.meta.url);

// This works by getting the about: URI and using it to dynamically import the
// app's main entry file. It lets me have only 1 HTML file, essentially removing
// duplicate code.
//
// about:life-${app}
const app = document.location.pathname.replace("life-", "");
AppendStyles();

const strScriptURL = `${BASE_URL}/dist/apps/${app}/page/index.js`;
logger.Log("Importing '%o' for app '%o'...", strScriptURL, app);
await import(strScriptURL);
