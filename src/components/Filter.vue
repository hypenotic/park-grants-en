<template v-if="this.$store.state.locationList != null">
    <section class="filter" >
        <div id="mobile-filter-trigger">
            <i class="fa fa-sliders" aria-hidden="true"></i> <span>Filters</span>
        </div>
        <div class="filter-bar">
            <ul>
                <li><span>FILTER: </span><span style="text-transform: none;"><span class="info" v-on:click="showActivityList = !showActivityList"> Find park events based on the kinds of activities they do</span></span><span id="copy-selected-acts"></span></li>
            </ul>

            <div class="activity-list" v-bind:class="{ 'not-hidden': showActivityList }">
                <form>
                    <div class="activity-groups">
                        <div class="activity-groups__single mb30" v-for="parent in this.$store.state.activityList" :key="parent.id">
                            <div class="activity-groups__single__header">
                                <img :src="parent.icon" :alt="parent.name">
                                <h6 style="color: white;" v-html="parent.name">
                                </h6>
                            </div>
                            <ul>
                                <li class="map-chbx-trigger" v-for="child in parent.children" :key="child.id"> 
                                    <input type="checkbox" class="chk-btn" :data-term="child.name" :id="child.slug" :name="parent.slug+'[]'" :value="child.id">
                                    <label :for="child.slug" v-html="child.name">
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="submit-bar">
                        <div class="submit-bar-wrapper">
                            <span id="whole-sentence-count"><span id="activities-selected">0</span> activities selected. Ready?</span>
                            <div type="submit" class="button button--small" id="apply-search">Search!</div>
                            <div id="clear-filters" class="hidden-clear"><span>Clear All Activities</span></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>        
        
        <ul class="map-type">
            <li id="map-view-trigger" class="view-trigger active-trigger"><i class="fa fa-map-o fa-2x" aria-hidden="true"></i></li>
            <li id="list-view-trigger" class="view-trigger"><i class="fa fa-list fa-2x" aria-hidden="true"></i></li>
        </ul>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                showActivityList: false
            }
        },
        mounted() {
            console.log('test', this.$store.state.activityList);
        },
        methods: {
           
        },
        computed: {
        },
    }
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';
@import '../styles/components/filter.scss';

</style>