import Vue from 'vue';
import Vuex from 'vuex';
import { commands, CommandState } from './modules/commands';
import { databases, DBState} from './modules/databases';
import { collections, ColState } from './modules/collections';
import { terminal, TerminalState } from './modules/terminal';

Vue.use(Vuex);

export type RootState = {
    commands: CommandState
    databases: DBState,
    collections: ColState,
    terminal: TerminalState
}

export const store = new Vuex.Store<RootState>({
    modules: {
        commands,
        databases,
        collections,
        terminal
    },
    strict: true
});
