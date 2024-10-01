const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

export const prefs = [
	{
		label: "General",
		description: "aka unsorted",
		opts: [
			{
				label: "Display directories first",
				pref: "fm.general.dirs-first",
				type: PREF_BOOL,
			},
		],
	},
];
