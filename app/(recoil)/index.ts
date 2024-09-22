import {atom} from 'recoil'

interface Graph{
    id : number,
    nodeValue : string,
    edgeValue : string
}

export const graphState = atom<Graph[]>({
    key: 'graphState',
    default: [{
        id: 1,
        nodeValue: '',
        edgeValue: ''
    }]
})

export const sourceState = atom({
    key: 'sourceState',
    default: ''
})

export const destState = atom({
    key: 'destState',
    default: ''
})

export const pathState = atom({
    key: 'pathState',
    default: []
})

export const distanceState = atom({
    key: 'distanceState',
    default: 0
})