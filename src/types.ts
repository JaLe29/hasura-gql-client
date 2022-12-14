export enum OrderType {
	DESC = 'desc',
	ASC = 'asc',
}

type Key = string | number | symbol;

export interface SelectOptions {
	limit?: number;
	offset?: number;
	orderBy?: Record<string, OrderType>;
	where?: Where;
}

export interface AggregateOptions {
	where?: Where;
}

export interface UpdateOptions {
	where?: Where;
}

export interface ClientOptions {
	host: string;
	customHeaders?: Record<string | 'x-hasura-admin-secret', string>;
	debug?: boolean;
}

export type NonEmptyArr<T> = [T, ...T[]];

type Unpack<A> = A extends Array<infer E> ? E : A;

type AnyArray = any[] | ReadonlyArray<any>;

type AnyFunction = (...args: any[]) => any;

type Primitive = number | string | boolean | null | undefined;

type UnionForAny<T> = T extends never ? 'A' : 'B';

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type IsStrictlyAny<T> = UnionToIntersection<UnionForAny<T>> extends never ? true : false;

export type ObjectPathsWithArray<Obj, KeyPrefix extends string = '', Depth extends number = 3> = Depth extends never
	? never
	: true extends IsStrictlyAny<Obj>
	? never
	: Obj extends Primitive | Date | AnyFunction
	? never
	: {
			[K in keyof Unpack<Obj> & string]: Unpack<Obj>[K] extends Primitive
				? `${KeyPrefix}${K}`
				:
						| never
						| ObjectPathsWithArray<
								Unpack<Obj[K & keyof Obj]>,
								`${KeyPrefix}${K}${Obj[K & keyof Obj] extends AnyArray ? `` : ''}.`,
								[never, 0, 1, 2, 3][Depth]
						  >;
	  }[keyof Unpack<Obj> & string];

export type ObjectPaths<Obj, KeyPrefix extends string = '', Depth extends number = 3> = Depth extends never
	? never
	: true extends IsStrictlyAny<Obj>
	? never
	: Obj extends Primitive | Date | AnyFunction
	? never
	: {
			[K in keyof Unpack<Obj> & string]: Unpack<Obj>[K] extends Primitive ? `${KeyPrefix}${K}` : never;
	  }[keyof Unpack<Obj> & string];

export type DeepPick<T, K extends string> = T extends object
	? {
			[P in Head<K> & keyof T]: T[P] extends readonly unknown[]
				? DeepPick<T[P][number], Tail<Extract<K, `${P}.${string}`>>>[]
				: DeepPick<T[P], Tail<Extract<K, `${P}.${string}`>>>;
	  }
	: T;

export type PropertyValuexxx<Obj, Property extends Key> = Obj extends object
	? Property extends `${infer Parent}.${infer Leaf}`
		? Parent extends keyof Obj
			? PropertyValuexxx<Obj[Parent], Leaf>
			: Parent extends `${infer SubParent}[${number}]`
			? SubParent extends keyof Obj
				? PropertyValuexxx<Unpack<Obj[SubParent]>, Leaf>
				: never
			: never
		: Property extends `${infer ArrayKey}[${number}]`
		? ArrayKey extends keyof Obj
			? Unpack<Obj[ArrayKey]>
			: never
		: Property extends keyof Obj
		? Obj[Property]
		: never
	: never;

type Head<T extends string> = T extends `${infer First}.${string}` ? First : T;

type Tail<T extends string> = T extends `${string}.${infer Rest}` ? Rest : never;

const LEAF_OPERATORS = ['_and', '_or'] as const;

const PROPERTY_OPERATORS = ['_eq', '_gt', '_gte', '_lt', '_lte', '_in', '_like'] as const;

type WhereLeaf = Partial<Record<typeof PROPERTY_OPERATORS[number], PropertyValue>> | { [P in PropertyName]: WhereLeaf };

type PropertyName = string;

type PropertyFinalValue = string | number | boolean;
type PropertyValue = PropertyFinalValue[] | PropertyFinalValue;
type WhereRoot = PropertyName | typeof LEAF_OPERATORS[number];
export type Where = Record<WhereRoot, WhereLeaf>;
