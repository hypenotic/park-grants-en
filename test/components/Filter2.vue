<template v-if="this.$store.state.locationList != null">
    <section class="filter" >
        <div id="mobile-filter-trigger">
            <i class="fa fa-sliders" aria-hidden="true"></i> <span>Filters</span>
        </div>
        <div class="filter-bar">
            <ul>
                <li>
                    <p><strong style="color: white;">Filter</strong>: 
                        <span class="info" id="filter-dropdown" if v-on:click="filterTrigger">Find park events based on the kinds of activities they do</span>
                        <span id="copy-selected-acts"></span>
                    </p>
                </li>
            </ul>

            <div class="activity-list" v-bind:class="{ 'not-hidden': this.$store.state.filterViewState }">
                <form>
                    <div class="activity-groups">
                        <div class="activity-groups__single mb30" v-for="parent in this.$store.state.activityList" :key="parent.id">
                            <div class="activity-groups__single__header">
                                <img :src="parent.icon" :alt="parent.name">
                                <h6 style="color: white;" v-html="parent.name">
                                </h6>
                            </div>
                            <ul id="ck-button">
                                <li class="map-chbx-trigger" v-for="child in parent.children" :key="child.term_id"> 
                                    <label>
									<input type="checkbox" class="ck-box" @change="filterChange" hidden v-model="checkedCategories" :value="child.term_id" />
									<span>{{child.name}}</span>
									</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="submit-bar">
                        <div class="submit-bar-wrapper">
                            <span id="whole-sentence-count"><span id="activities-selected" v-html="filterCount"></span> activities selected. Ready?</span>
                            <div type="submit" class="button button--small" id="apply-search">Search!</div>
                            <div id="clear-filters" v-bind:class="[checkedCategories.length >0 ? '' : 'hidden-clear']"><span>Clear All Activities</span></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>  

        <div class="legend">
            <ul>
                <li>Legend:</li>
                <li>                    
                    <svg width="32px" height="40px" viewBox="0 0 32 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Asset-5" fill-rule="nonzero">
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#FFFFFF"></path>
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#B3BD35"></path>
                                <circle id="Oval" fill="#FFFFFF" opacity="0.34" transform="translate(15.645299, 15.645299) rotate(-83.350000) translate(-15.645299, -15.645299) " cx="15.6452988" cy="15.6452988" r="10.5"></circle>
                            </g>
                        </g>
                    </svg>
                    <span>- Past</span>
                </li>
                <li>
                    <svg width="32px" height="40px" viewBox="0 0 32 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Asset-5" fill-rule="nonzero">
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#FFFFFF"></path>
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#ee7633"></path>
                                <circle id="Oval" fill="#FFFFFF" opacity="0.34" transform="translate(15.645299, 15.645299) rotate(-83.350000) translate(-15.645299, -15.645299) " cx="15.6452988" cy="15.6452988" r="10.5"></circle>
                            </g>
                        </g>
                    </svg>
                    <span>- In &lt; 30 days</span>
                </li>
                <li>
                    <svg width="32px" height="40px" viewBox="0 0 32 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Asset-5" fill-rule="nonzero">
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#FFFFFF"></path>
                                <path d="M31.9883855,16.7909689 C32.321886,7.86124192 25.4323408,0.348926483 16.6001557,0.0117427985 C7.76797048,-0.325440886 0.337714122,6.64019178 0.00421358682,15.5699188 C-0.292102436,24.5076427 15.1387789,40 15.1387789,40 C15.1387789,40 31.6516627,25.6515261 31.9883855,16.7909689 Z" id="Shape" fill="#2bace0"></path>
                                <circle id="Oval" fill="#FFFFFF" opacity="0.34" transform="translate(15.645299, 15.645299) rotate(-83.350000) translate(-15.645299, -15.645299) " cx="15.6452988" cy="15.6452988" r="10.5"></circle>
                            </g>
                        </g>
                    </svg>
                    <span>- In &gt; 30 days</span>
                </li>    
            </ul>
        </div>      
        
        <ul class="map-type">
            <li id="map-view-trigger" v-on:click="listTrigger" class="view-trigger" v-bind:class="[this.$store.state.listViewState ? '' : 'active-trigger']"><i class="fa fa-map-o fa-2x" aria-hidden="true"></i></li>
            <li id="list-view-trigger" v-on:click="listTrigger" class="view-trigger" v-bind:class="[this.$store.state.listViewState ? 'active-trigger' : '']"><i class="fa fa-list fa-2x" aria-hidden="true"></i></li>
        </ul>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                showActivityList: false,
                filters: [],
                checkedCategories: [],
                clearFilterCheck: []
            }
        },
        mounted() {
            let app = this;
            // Listen for when the filter submit button is pressed
            document.getElementById("clear-filters").onclick = function() {
                app.checkedCategories = [];
            };
        },
        methods: { 
            changeFilters() {
                console.log('change filters');

            },
            applyFilters() {
                console.log('apply filters');
            },
            filterChange() {
                // Check if there are any active category buttons
                if (this.checkedCategories.length > 0) {
                    this.$store.dispatch("filterChange", this.checkedCategories);
                    this.clearFilterCheck = [];
                } else {
                    // if not, just reset everything
                    this.$store.dispatch("clearFilters", 'active');
                    this.checkedCategories = [];
                    this.clearFilterCheck = ['all'];
                }
            },
            clearFilters(event) {
                // if (event.target.checked) {
                //     this.$store.dispatch("clearFilters", 'active');
                //     this.checkedCategories = [];
                // } else {
                //     return
                // }
            },
            listTrigger() {
                this.$store.dispatch("listViewState",this.$store.state.listViewState );

                // TK – Might wanna store the searchbox status in the store
                let input = document.getElementById('pac-input');
                if (input.classList.contains('small-search')) {
                } else {
                    input.classList.add('small-search');
                }
            },
            filterTrigger() {
                this.$store.dispatch("filterViewState",this.$store.state.filterViewState );
            }
        },
        computed: {
            filterCount() {
                return this.checkedCategories.length;
            }
        },
    }
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';
@import '../styles/components/filter.scss';

</style>