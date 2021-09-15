export declare function isES2015Class(cls: any): cls is new (...args: any[]) => any;
export declare function isObject(value: any): value is object | Function;
export declare function walkObject(value: any, callback?: (target: any, set: Set<any>) => boolean | void): Set<any>;
/**
 * Measure the complexity of an object as you traverse the field and prototype chain. If max is specified, when the complexity reaches max, the traversal is terminated and it returns the max. In this function, one object and function are counted as a complexity of 1, and primitives are not counted as a complexity.
 */
export declare function complexity(value: any, max?: number): number;
