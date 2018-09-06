import { FilterQuery, FindOneOptions } from 'mongodb';

function parseJson(s: string){
    try{
        return eval('(' + s + ')');
    } catch(e) {
        return {};
    }
}

function parseJsonList(s: string){
    return s.split('}{')
        .map(_ => _.replace(/^\{|\}$/g, ''))
        .map(_ => parseJson(`{${_}}`));
}

export type FindResult<T> = [FilterQuery<T>, FindOneOptions?];
export function find<T>(args?: string[]): FindResult<T> {
    if(args && args.length > 0) {
        return parseJsonList(args.join('')) as any;
    }
    return [{}];
};
