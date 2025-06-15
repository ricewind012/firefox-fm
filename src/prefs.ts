const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

export interface Pref {
	description?: string;
	label: string;
	name: string;
	/**
	 * @see {@link nsIPrefBranch}
	 */
	type:
		| nsIPrefBranch["PREF_STRING"]
		| nsIPrefBranch["PREF_INT"]
		| nsIPrefBranch["PREF_BOOL"];
}

export interface PrefGroup {
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
				name: PREF_DISPLAY_DIRS_FIRST,
				type: PREF_BOOL,
			},
		],
	},
];
