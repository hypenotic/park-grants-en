import { state } from './state'

import { 
    SET_RESOURCES, 
    RECEIVE_GRANT_DATA, 
    TOGGLE_LANGUAGE, 
    ADD_SINGLE_RESOURCE,
    SET_LOCATION_LIST,
    SET_ACTIVITY_LIST 
} from './mutation-types'

export const mutations = {
    SET_RESOURCES(state, list) {
        state.resourceList = list
    },
    SET_LOCATION_LIST(state, list) {
        state.locationList = list
    },
    SET_ACTIVITY_LIST(state, list) {
        state.activityList = list
    },
    TOGGLE_LANGUAGE(state, lang) {
        state.language = lang
    },
    ADD_SINGLE_RESOURCE(state, post, id) {
        let copy = state.singlePostCache
        // Check if key/post exist already
        if (copy.hasOwnProperty(id)) {
            console.log('POST ALREADY IN STORE')
            return
        } else {
            console.log('ADDING PSOT TO STORE')
            copy[id] = post;
            state.singlePostCache = copy
        }
        
    },
}