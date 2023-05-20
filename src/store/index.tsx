import { proxy } from 'valtio'

export const state = proxy({
    timesContinue: 0,
    findAutomatic: false,
    findWithExample: false,
})