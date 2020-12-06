export declare type Resource<Name extends string, IdPrefix extends string, TableName extends string = Name, Plural extends string = `${TableName}s`> = {
    id: `${IdPrefix}_${string}`;
};
