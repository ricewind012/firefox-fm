type XDGBaseDirectory_t =
	| "XDG_DESKTOP_DIR"
	| "XDG_DOWNLOAD_DIR"
	| "XDG_TEMPLATES_DIR"
	| "XDG_PUBLICSHARE_DIR"
	| "XDG_DOCUMENTS_DIR"
	| "XDG_MUSIC_DIR"
	| "XDG_PICTURES_DIR"
	| "XDG_VIDEOS_DIR";

export type UserDir_t =
	| "documents"
	| "downloads"
	| "home"
	| "music"
	| "pictures"
	| "videos";

const homeDir = Services.env.get("HOME");
const configDir =
	Services.env.get("XDG_CONFIG_HOME") || PathUtils.join(homeDir, ".config");
const userDirsFile = await IOUtils.readUTF8(
	PathUtils.join(configDir, "user-dirs.dirs"),
);
const userDirs = new Map<XDGBaseDirectory_t, string>(
	userDirsFile
		.split("\n")
		.filter((e) => e && !e.startsWith("#"))
		.map((e) => e.split("="))
		.map(([envVar, path]) => [
			envVar as XDGBaseDirectory_t,
			path.replace(/"/g, "").replace("$HOME", homeDir),
		]),
);

export const nsIFile = Components.Constructor(
	"@mozilla.org/file/local;1",
	"nsIFile",
	"initWithPath",
);

export function GetFileExtension(strPath: string) {
	if (!strPath) {
		return "";
	}

	const nLastIndex = strPath.lastIndexOf(".");
	return nLastIndex !== -1 ? strPath.slice(nLastIndex + 1).toLowerCase() : "";
}

export function GetPathForName(strName: UserDir_t) {
	switch (strName) {
		case "home":
			return homeDir;
		case "documents":
			return userDirs.get("XDG_DOCUMENTS_DIR");
		case "downloads":
			return userDirs.get("XDG_DOWNLOAD_DIR");
		case "music":
			return userDirs.get("XDG_MUSIC_DIR");
		case "pictures":
			return userDirs.get("XDG_PICTURES_DIR");
		case "videos":
			return userDirs.get("XDG_VIDEOS_DIR");
		default:
			return "/";
	}
}
