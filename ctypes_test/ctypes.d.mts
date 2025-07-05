/** biome-ignore-all lint/style/useNamingConvention: how do i ignore files */

// if there is any documentation at all, it's from mozilla written 50 years ago
// HEEEEEEEEEEEEEEEEEEELP

// i actually think it's kinda pointless having this here, c types are not
// compatible with the js ones lol

// #region C types
type ptr<T> = T;

type bool = boolean;
type char = string;
type int = number;
type size_t = number;
type time_t = number;
type uint8_t = number;
type uint16_t = number;
type uint32_t = number;
type unsigned = number;
// #endregion

// #region C types v2
/*
type bool = CType<bool>;
type char = CType<char>;
type char16_t = CType<char16_t>;
type default_abi = CType<default_abi>;
type double = CType<double>;
type float = CType<float>;
type float32_t = CType<float32_t>;
type float64_t = CType<float64_t>;
type int = CType<int>;
type int16_t = CType<int16_t>;
type int32_t = CType<int32_t>;
type int64_t = CType<int64_t>;
type int8_t = CType<int8_t>;
type intptr_t = CType<intptr_t>;
type jschar = CType<jschar>;
type long = CType<long>;
type long_long = CType<long_long>;
type off_t = CType<off_t>;
type short = CType<short>;
type signed_char = CType<signed_char>;
type size_t = CType<size_t>;
type ssize_t = CType<ssize_t>;
type stdcall_abi = CType<stdcall_abi>;
type thiscall_abi = CType<thiscall_abi>;
type uint16_t = CType<uint16_t>;
type uint32_t = CType<uint32_t>;
type uint64_t = CType<uint64_t>;
type uint8_t = CType<uint8_t>;
type uintptr_t = CType<uintptr_t>;
type unsigned = CType<unsigned>;
type unsigned_char = CType<unsigned_char>;
type unsigned_int = CType<unsigned_int>;
type unsigned_long = CType<unsigned_long>;
type unsigned_long_long = CType<unsigned_long_long>;
type unsigned_short = CType<unsigned_short>;
type void_t = CType<void_t>;
type voidptr_t = CType<voidptr_t>;
type winapi_abi = CType<winapi_abi>;
*/
// #endregion

type CVarType =
	| "bool"
	| "char"
	| "char16_t"
	| "double"
	| "float"
	| "float32_t"
	| "float64_t"
	| "int"
	| "int16_t"
	| "int32_t"
	| "int64_t"
	| "int8_t"
	| "intptr_t"
	| "jschar"
	| "long"
	| "long_long"
	| "off_t"
	| "short"
	| "signed_char"
	| "size_t"
	| "ssize_t"
	| "uint16_t"
	| "uint32_t"
	| "uint64_t"
	| "uint8_t"
	| "uintptr_t"
	| "unsigned"
	| "unsigned_char"
	| "unsigned_int"
	| "unsigned_long"
	| "unsigned_long_long"
	| "unsigned_short"
	| "void_t"
	| "voidptr_t";

interface CTypeToJSTypeMap {
	bool: boolean;
	char: string;
	char16_t: string;
	double: number;
	float: number;
	float32_t: number;
	float64_t: number;
	int: number;
	int16_t: number;
	int32_t: number;
	int64_t: number;
	int8_t: number;
	intptr_t: number;
	jschar: any;
	long: number;
	long_long: number;
	off_t: any;
	short: any;
	signed_char: any;
	size_t: number;
	ssize_t: number;
	uint16_t: number;
	uint32_t: number;
	uint64_t: number;
	uint8_t: number;
	uintptr_t: any;
	unsigned: number;
	unsigned_char: any;
	unsigned_int: number;
	unsigned_long: number;
	unsigned_long_long: number;
	unsigned_short: any;
	void_t: any;
	voidptr_t: any;
}

declare module "resource://gre/modules/ctypes.sys.mjs" {
	export namespace ctypes {
		class CType {
			get name(): string;
			get ptr(): this;
			get size(): number;
		}

		class CDataFinalizer {
			constructor();
			constructor(a: CType, funcPtr: CData);
			dispose(): number;
			forget(): number;
		}

		class FunctionType {}

		class PointerType {}

		class StructType<
			TName extends string,
			TArgs extends Record<string, CType>[],
		> extends CType {
			constructor(func: TName, args: TArgs);
			define(...args: any[]): any;
			get fields(): TArgs;
		}

		class CData {
			/** @returns ptr of this */
			address(): CData;
			get contents(): number;
			decrement(): any;
			increment(): any;
			isNull(): boolean;
			// Uncaught TypeError: base type ctypes.FunctionType(ctypes.default_abi, ctypes.void, [mpd_settings]).ptr(ctypes.UInt64("0x7f424c856230")) is not an 8-bit or 16-bit integer or character type
			readString(): any;
			// Uncaught TypeError: base type ctypes.FunctionType(ctypes.default_abi, ctypes.void, [mpd_settings]).ptr(ctypes.UInt64("0x7f424c856230")) is not an 8-bit or 16-bit integer or character type
			readStringReplaceMalformed(): any;
			// Uncaught TypeError: base type ctypes.FunctionType(ctypes.default_abi, ctypes.void, [mpd_settings]).ptr(ctypes.UInt64("0x7f424c856230")) is not an 8-bit or 16-bit integextends Record<CVarType, any> er or character type
			readTypedArray(): any;
			// Uncaught TypeError: .value only works on character and numeric types, not `ctypes.FunctionType(ctypes.default_abi, ctypes.void, [mpd_song]).ptr`
			get value(): any;
			valueOf(...args: any[]): CData;
		}

		class Library {
			close(): void;

			/**
			 * Declares a function with the given properties, and resolves the
			 * symbol address in the library.
			 *
			 * @see https://searchfox.org/mozilla-central/source/js/src/ctypes/Library.cpp#296
			 */
			declare(
				name: string,
				abi: CType,
				returnType: CType,
				...args: CType[]
			): CData;

			/**
			 * Declares a symbol of 'type', and resolves it. The object that
			 * comes back will be of type 'type', and will point into the symbol
			 * data.
			 *
			 * This data will be both readable and writable via the usual CData
			 * accessors. If 'type' is a PointerType to a FunctionType, the result will
			 * be a function pointer, as with 1).
			 *
			 * @see https://searchfox.org/mozilla-central/source/js/src/ctypes/Library.cpp#296
			 */
			declare(name: string, type: CType): CData;
		}

		function ArrayType(ctype: CType): CType;

		function cast(from: CData, to: CType): CData;
		function getRuntime(ctype): CData;
		function libraryName<T extends string>(lib: T): `lib${T}.so`;
		function open(lib: string): Library;
	}
}
