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
const userDirs = userDirsFile
	.split("\n")
	.filter((e) => e && !e.startsWith("#"))
	.map((e) => e.split("="))
	.map(([envVar, path]) => ({
		[envVar]: path.replace(/"/g, "").replace("$HOME", homeDir),
	}))
	.reduce((a, b) => Object.assign(a, b)) as Record<XDGBaseDirectory_t, string>;

export const newFile = Components.Constructor(
	"@mozilla.org/file/local;1",
	"nsIFile",
	"initWithPath",
);

export function getFileExtension(path: string) {
	if (!path) {
		return "";
	}

	const lastIndex = path.lastIndexOf(".");
	return lastIndex !== -1 ? path.slice(lastIndex + 1).toLowerCase() : "";
}

export function getPathForName(name: UserDir_t) {
	switch (name) {
		case "home":
			return homeDir;
		case "documents":
			return userDirs.XDG_DOCUMENTS_DIR;
		case "downloads":
			return userDirs.XDG_DOWNLOAD_DIR;
		case "music":
			return userDirs.XDG_MUSIC_DIR;
		case "pictures":
			return userDirs.XDG_PICTURES_DIR;
		case "videos":
			return userDirs.XDG_VIDEOS_DIR;
		default:
			return "/";
	}
}
