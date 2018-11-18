import { RootState } from '../index';
import { Module } from 'vuex';
import { IDBCol, DBCollectionsRequest, DBCollections } from '../../dto/DBCollections';
import { Response } from '../../dto/Response';
import { api } from '@/api/data';
import { filter, first } from 'rxjs/operators';

export type Cols = IDBCol[];
export type ColState = {items: {[db: string]: Cols}};
const state: ColState = {
    items: {}
};

export const collections: Module<ColState, RootState> = {
    namespaced: true,
    state,
    actions: {
        refresh(context, db) {
            let s = context.state.items[db];
            if (s && s.length > 0) return;
            const req = new DBCollectionsRequest();
            req.db = db;
            api
                .pipe(filter(({data}) => Response.read(data).id === req.id))
                .pipe(first())
                .subscribe(({data}) => context.commit('refresh', {db, cols: DBCollections.read(data).list}));
                api.next(req.write());
        }
    },
    mutations: {
        refresh(state, paylod: {db: string, cols: Cols}) {
            state.items = {
                ...state.items,
                [paylod.db]: paylod.cols
            }
        }
    },
    getters: {
        collections: (state) => (db: string) => {
            return state.items[db];
        }
    }
}