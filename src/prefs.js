const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

export const PREF_DISPLAY_DIRS_FIRST = "fm.general.dirs-first";

export const prefs = [
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
