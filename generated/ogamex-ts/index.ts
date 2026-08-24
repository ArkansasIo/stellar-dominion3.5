/**
 * Compatibility entrypoint for the generated OGameX rewrite tree.
 *
 * The migration bridge expects this module to exist. The current repository
 * keeps the maintained OGameX ports under shared/ogamex, so this entrypoint
 * re-exports that stable public surface until additional generated ports are
 * added here.
 */
export * from "../../shared/ogamex/coordinateDistance";
export * from "../../shared/ogamex/enums";
export * from "../../shared/ogamex/missionDistance";
export * from "../../shared/ogamex/services/characterClassService";
export * from "../../shared/ogamex/universeConstants";
