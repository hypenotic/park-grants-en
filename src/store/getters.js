export const getters = {
    allLocations: state => {
        return state.locationList
    },
    allActivities: state => {
        return state.activityList
    },
    allActiveEvents: state => {
        return state.activeEvents
    }
}