import * as types from './mutation-types'
import axios from 'axios';
// import _ from 'lodash';

export const actions = {
    getLocations({commit, dispatch, context, state}, info) {
        console.log('getLocations dispatched');
        // axios.get('http://dev.hypenotic.com/pp-map/wp-json/mapdata/v1/all')
        // axios.get('https://parkpeople.ca/listings/wp-json/mapdata/v1/all')
        axios.get('http://dev.hypenotic.com/pp-map/wp-json/eventdata/v1/all')
        .then(function (response) {
            // let pageSlugKeys = _.mapKeys(response.data, 'slug');
            // commit(types.SET_PAGE_LIST, response.data);
            commit(types.SET_LOCATION_LIST, response.data);
            // commit(types.SET_PAGE_TEST, test);
        })
        .catch(function (error) {
            console.log(error)
        })
    },
    getActivities({commit, dispatch, context, state}, info) {
        console.log('getActivities dispatched');
        // axios.get('http://dev.hypenotic.com/pp-map/wp-json/mapdata/v1/all')
        // axios.get('https://parkpeople.ca/listings/wp-json/mapdata/v1/all')
        axios.get('http://dev.hypenotic.com/pp-map/wp-json/activitydata/v1/all')
        .then(function (response) {
            commit(types.SET_ACTIVITY_LIST, response.data);
        })
        .catch(function (error) {
            console.log(error)
        })
    },
    
}