import React from 'react';
/**
 * A handler for HTML click/change/input events
 * @example
 * ```typescript
 * const handleChangeName = handler(setName);
 *
 * <Input onChange={handleChangeName} />;
 * ```
 */
export declare function handler(setter: React.Dispatch<React.SetStateAction<string>>): ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => void;
