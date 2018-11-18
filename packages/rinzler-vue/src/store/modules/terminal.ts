import { RootState } from '../index';
import { Module } from 'vuex';
import { FindRequest, Found } from '../../dto/Find';
import { Response } from '../../dto/Response';
import { api } from '@/api/data';
import { filter } from 'rxjs/operators';

export type TerminalState = 
{cols: {[dbcol:string]: {top10: any[]}}};
const state: TerminalState = {
    cols:{}
};

export const terminal: Module<TerminalState, RootState> = {
    namespaced: true,
    state,
    actions: {
        top10(context, {db, collection}) {
            let s = state.cols[`${db}.${collection}`];
            if (s && s.top10 && s.top10.length > 0) return;

            context.commit('refresh', {db, collection});
            const req = new FindRequest();
            req.db = db;
            req.collection = collection;
            req.find = {};
            req.options = {limit: 10};
            api.next(req.write());
            api
                .pipe(filter(({data}) => Response.read(data).id === req.id))
                .subscribe(({data}) => context.commit('append', {db, collection, item: Found.read(data).data}));
        }
    },
    mutations: {
        refresh(state, paylod: {db: string, collection: string}){
            state.cols = {
                ...state.cols,
                [`${paylod.db}.${paylod.collection}`]: {top10:[]}
            };
        },
        append(state, paylod: {db: string, collection: string, item: any}) {
            console.log(paylod.item);
            let s = state.cols[`${paylod.db}.${paylod.collection}`];
            state.cols = {
                ...state.cols,
                [`${paylod.db}.${paylod.collection}`]: {
                    ...s,
                    top10: [
                        ...s.top10,
                        paylod.item
                    ]
                }
            }
        }
    },
    getters: {
        getTop10: (state) => (paylod: {db: string, collection: string}) => {
            let s = state.cols[`${paylod.db}.${paylod.collection}`];
            console.log('get', paylod.db, paylod.collection, s)
            return (s ||{}).top10;
        }
    }
}