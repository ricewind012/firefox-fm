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
	.reduce((a, b) => Object.assign(a, b));

export function newFile(path) {
	const file = Cc["@mozilla.org/file/local;1"].getService(Ci.nsIFile);
	file.initWithPath(path);

	return file;
}

export function getPathForName(name) {
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
