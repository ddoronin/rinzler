import { RootState } from '../index';
import { Module } from 'vuex';
import { FindRequest, Found } from '../../dto/Find';
import { Response } from '../../dto/Response';
import { api } from '@/api/data';
import { filter } from 'rxjs/operators';

export type TerminalState = 
{cols: {[dbcol:string]: {top100: any[]}}};
const state: TerminalState = {
    cols:{}
};

export const terminal: Module<TerminalState, RootState> = {
    namespaced: true,
    state,
    actions: {
        top100(context, {db, collection}) {
            let s = state.cols[`${db}.${collection}`];
            if (s && s.top100 && s.top100.length > 0) return;

            context.commit('refresh', {db, collection});
            const req = new FindRequest();
            req.db = db;
            req.collection = collection;
            req.find = {};
            req.options = {limit: 100};
            api.next(req.write());
            api
                .pipe(filter(({data}) => Response.read(data).id === req.id))
                .subscribe(({data}) => setTimeout(() => context.commit('append', {db, collection, item: Found.read(data).data}), 0));
        }
    },
    mutations: {
        refresh(state, paylod: {db: string, collection: string}){
            state.cols = {
                ...state.cols,
                [`${paylod.db}.${paylod.collection}`]: {top100:[]}
            };
        },
        append(state, paylod: {db: string, collection: string, item: any}) {
            console.log(paylod.item);
            let s = state.cols[`${paylod.db}.${paylod.collection}`];
            state.cols = {
                ...state.cols,
                [`${paylod.db}.${paylod.collection}`]: {
                    ...s,
                    top100: [
                        ...s.top100,
                        paylod.item
                    ]
                }
            }
        }
    },
    getters: {
        getTop100: (state) => (paylod: {db: string, collection: string}) => {
            let s = state.cols[`${paylod.db}.${paylod.collection}`];
            console.log('get', paylod.db, paylod.collection, s)
            return (s ||{}).top100;
        }
    }
}