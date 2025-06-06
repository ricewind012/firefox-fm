const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

interface Pref {
	description?: string;
	label: string;
	pref: string;
	/**
	 * @see {@link nsIPrefBranch}
	 */
	type: number;
}

interface PrefGroup {
	description: string;
	label: string;
	opts: Pref[];
}

export const PREF_DISPLAY_DIRS_FIRST = "fm.general.dirs-first";

export const prefs: PrefGroup[] = [
	{
		label: "General",
		description: "aka unsorted",
		opts: [
			{
				label: "Display directories first",
				pref: PREF_DISPLAY_DIRS_FIRST,
				type: PREF_BOOL,
			},
		],
	},
];
