import { RootState } from '../index';
import { Module } from 'vuex';
import { IDB, DataBaseListRequest, DataBaseList } from '../../dto/DataBaseList';
import { Response } from '../../dto/Response';
import { api } from '@/api/data';
import { filter } from 'rxjs/operators';

export type DBList = IDB[];
export type DBState = {list: DBList};
const state: {list: DBList} = {list: []};

export const databases: Module<{list: DBList}, RootState> = {
    namespaced: true,
    state,
    getters: {
    },
    actions: {
        refresh(context) {
            if (context.state.list && context.state.list.length > 0) return;
            const req = new DataBaseListRequest();
            api.next(req.write());
            api
                .pipe(filter(({data}) => Response.read(data).id === req.id))
                .subscribe(({data}) => context.commit('refresh', DataBaseList.read(data).list));
        }
    },
    mutations: {
        refresh(state, dbs: DBList) {
            state.list = dbs;
        }
    }
}