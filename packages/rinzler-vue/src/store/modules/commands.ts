import { RootState } from '../index';
import { Module } from 'vuex';

export enum Status {
    PENDING = 'PENDING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED'
}

export interface ICommand {
    cmd: string;
    status: Status;
    created: Date;
}

export type CommandState = ICommand[];

const state: CommandState = [];

export const commands: Module<CommandState, RootState> = {
    state,
    getters: {
    },
    actions: {
        dbs(context, dbs) {
            console.log('action for ', dbs);
        },
        push(context, command: ICommand) {
            context.commit('newCommand', command);
        }
    },
    mutations: {
        
        newCommand(state, command: ICommand) {
            state.push(command);
        }
    }
}