import { BASE_URL } from "@/shared/consts";

declare global {
	interface ImportMeta {
		/**
		 * Current file's URL.
		 */
		url: string;
	}
}

const LOG_STYLE = [
	"background-color: AccentColor",
	"color: AccentColorText",
	"padding: 0 1ch",
].join(";");
const SHOULD_LOG = true;

export class CLogger {
	private m_strScope: string;

	constructor(strScope: string) {
		this.m_strScope = strScope.startsWith(BASE_URL)
			? strScope.replace(`${BASE_URL}/dist`, "src").replace(".js", "")
			: strScope;
	}

	private Print(strMethod: string, strFormat: string, ...args: any[]) {
		if (!SHOULD_LOG) {
			return;
		}

		console[strMethod](
			`%c${this.m_strScope}%c ${strFormat}`,
			`${LOG_STYLE}`,
			"",
			...args,
		);
	}

	Log(strFormat: string, ...args: any[]) {
		this.Print("log", strFormat, ...args);
	}

	Warn(strFormat: string, ...args: any[]) {
		this.Print("warn", strFormat, ...args);
	}

	Error(strFormat: string, ...args: any[]) {
		this.Print("error", strFormat, ...args);
	}

	Assert(bAssertion: boolean, strFormat: string, ...args: any[]) {
		if (bAssertion) {
			return;
		}

		this.Error(`Assertion failed: ${strFormat}`, ...args);
	}
}

export class CTimeLogger extends CLogger {
	private m_strLabel: string;
	private m_unTimestamp: number;

	constructor(strScope: string, strLabel: string) {
		super(strScope);
		this.m_strLabel = strLabel;
	}

	TimeStart() {
		this.m_unTimestamp = Date.now();
	}

	TimeEnd() {
		const unCurrentDate = Date.now();
		this.Log(
			"%s: took %o seconds",
			this.m_strLabel,
			(unCurrentDate - this.m_unTimestamp) / 1_000,
		);
	}
}
