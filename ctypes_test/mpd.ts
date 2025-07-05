import { ctypes } from "resource://gre/modules/ctypes.sys.mjs";

const mpd_settings = new ctypes.StructType("mpd_settings", [
	{ host: ctypes.char.ptr },
	{ port: ctypes.unsigned },
	{ timeout_ms: ctypes.unsigned },
	{ password: ctypes.char.ptr },
]);

const mpd_audio_format = new ctypes.StructType("mpd_audio_format", [
	{ sample_rate: ctypes.uint32_t },
	{ bits: ctypes.uint8_t },
	{ channels: ctypes.uint8_t },
	{ reserved1: ctypes.uint32_t },
]);

const mpd_status = new ctypes.StructType("mpd_status", [
	{ volume: ctypes.int },
	{ repeat: ctypes.bool },
	{ random: ctypes.bool },
	{ single: ctypes.int },
	{ consume: ctypes.int },
	{ queue_length: ctypes.unsigned },
	{ queue_version: ctypes.unsigned },
	{ state: ctypes.int },
	{ crossfade: ctypes.unsigned },
	{ mixrampdb: ctypes.float },
	{ mixrampdelay: ctypes.float },
	{ song_pos: ctypes.int },
	{ song_id: ctypes.int },
	{ next_song_pos: ctypes.int },
	{ next_song_id: ctypes.int },
	{ elapsed_time: ctypes.unsigned },
	{ elapsed_ms: ctypes.unsigned },
	{ total_time: ctypes.unsigned },
	{ kbit_rate: ctypes.unsigned },
	{ audio_format: mpd_audio_format },
	{ update_id: ctypes.unsigned },
	{ partition: ctypes.char.ptr },
	{ error: ctypes.char.ptr },
]);

const mpd_error_info = new ctypes.StructType("mpd_error_info", [
	{ code: ctypes.int },
	{ server: ctypes.int },
	{ at: ctypes.unsigned },
	{ system: ctypes.int },
	{ message: ctypes.char.ptr },
]);

const mpd_buffer = new ctypes.StructType("mpd_buffer", [
	{ write: ctypes.unsigned },
	{ read: ctypes.unsigned },
	{ data: ctypes.unsigned_char },
]);

const mpd_socket_t = ctypes.int;
const mpd_async = new ctypes.StructType("mpd_async", [
	{ fd: mpd_socket_t },
	{ error: mpd_error_info },
	{ input: mpd_buffer },
	{ output: mpd_buffer },
]);

const mpd_timeout = new ctypes.StructType("mpd_timeout", [
	{ tv_sec: ctypes.int },
	{ tv_usec: ctypes.int },
]);

const mpd_pair = new ctypes.StructType("mpd_pair", [
	{ name: ctypes.char.ptr },
	{ value: ctypes.char.ptr },
]);

const mpd_parser = new ctypes.StructType("mpd_parser", [
	{ result: ctypes.int },
	{ discrete: ctypes.bool },
	{ error: mpd_error_info },
	{ pair: mpd_pair },
]);

const mpd_connection = new ctypes.StructType("mpd_settings", [
	{ initial_settings: mpd_settings },
	{ settings: mpd_settings },
	{ version: ctypes.unsigned },
	{ error: mpd_error_info },
	{ async: mpd_async },
	{ timeout: mpd_timeout },
	{ parser: mpd_parser },
	{ receiving: ctypes.bool },
	{ sending_command_list: ctypes.bool },
	{ sending_command_list_ok: ctypes.bool },
	{ discrete_finished: ctypes.bool },
	{ command_list_remaining: ctypes.int },
	{ pair: mpd_pair },
	{ pair_state: ctypes.int },
	{ request: ctypes.char.ptr },
]);

const mpd_tag_value = new ctypes.StructType("mpd_tag_value", [
	{ value: ctypes.char.ptr },
]);

const time_t = ctypes.int;
const mpd_song = new ctypes.StructType("mpd_song", [
	{ uri: ctypes.char.ptr },
	{ tags: mpd_tag_value },
	{ duration: ctypes.unsigned },
	{ duration_ms: ctypes.unsigned },
	{ start: ctypes.unsigned },
	{ end: ctypes.unsigned },
	{ last_modified: time_t },
	{ added: time_t },
	{ pos: ctypes.unsigned },
	{ id: ctypes.unsigned },
	{ prio: ctypes.unsigned },
	{ finished: ctypes.bool },
	{ audio_format: mpd_audio_format },
]);

/**
 * Wrapper for easily getting `null` instead of being met with a shitty error.
 * @todo recursive ver
 */
// biome-ignore lint/style/noVar: <explanation>
var wrapCtypesNulls = (struct, value) =>
	struct.fields.flatMap(Object.keys).reduce((obj, key) => {
		obj[key] = value[key].isNull?.() ? null : value[key];
		return obj;
	}, {});

function library(lib: string, decls: Record<string, ctypes.CType[]>) {
	const library = ctypes.open(lib);
	const dec = Object.entries(decls).map(([name, args]) =>
		library.declare(name, ...args),
	);

	return [library, ...dec];
}

// Convert a null-terminated char pointer into a sized char array, and then
// convert that into a JS typed array.
// The resulting array will not be null-terminated.
// Stolen from https://searchfox.org/mozilla-central/source/toolkit/modules/subprocess/subprocess_unix.sys.mjs#83
function ptrToUint8Array(input) {
	let { cast, uint8_t } = ctypes;

	let len = 0;
	for (
		let ptr = cast(input, uint8_t.ptr);
		ptr.contents;
		ptr = ptr.increment()
	) {
		len++;
	}

	let aryPtr = cast(input, uint8_t.array(len).ptr);
	return new Uint8Array(aryPtr.contents);
}

// biome-ignore lint/style/noVar: <explanation>
var [
	libmpdclient,
	mpd_connection_free,
	mpd_connection_new,
	mpd_run_current_song,
	mpd_settings_new,
	mpd_song_free,
] = library("libmpdclient.so", {
	mpd_connection_free: [ctypes.default_abi, ctypes.void_t, mpd_connection],
	mpd_connection_new: [
		ctypes.default_abi,
		mpd_connection,
		ctypes.char.ptr,
		ctypes.unsigned_int,
		ctypes.unsigned_int,
	],
	mpd_run_current_song: [ctypes.default_abi, mpd_song, mpd_connection],
	mpd_settings_new: [
		ctypes.default_abi,
		mpd_settings,
		ctypes.char.ptr,
		ctypes.unsigned,
		ctypes.unsigned,
		ctypes.char.ptr,
		ctypes.char.ptr,
	],
	mpd_song_free: [ctypes.default_abi, ctypes.void_t, mpd_song],
});

const conn = mpd_connection_new(null, 0, 0);
const settings = wrapCtypesNulls(
	mpd_settings,
	mpd_settings_new(null, 0, 0, null, null),
);

const test = ctypes.open("libc.so");
const test2 = test.declare("get_something", ctypes.int);
