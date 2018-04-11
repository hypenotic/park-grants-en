<template>
     <div class="single-list-item">
        <div class="single-list-item-container">
            <div class="single-list-item__image">
                <img :src="item.image" :alt="item.title">
            </div>

            <div class="card-content">
                <h5>
                    <a :href="'https://parkpeople.ca/listings/events/?n='+ item.slug+ '&id='+ item.id+'&tdgrant=true'" target="_blank" v-html="item.title" v-if="item.timeframe !== 'past'"></a>
                    <span v-html="item.title" v-if="item.timeframe == 'past'"></span>
                </h5>
                
                <p class="single-list__group" v-if="item.listing[1] !== 'Title'"><i class="fa fa-users"></i> <span v-html="item.listing[1]"></span></p>
    
                <p class="single-list__date"><i class="fa fa-calendar-o" aria-hidden="true"></i> <span v-html="item.nice_start_date"></span></p>
    
                <p class="single-list__time"><i class="fa fa-clock-o" aria-hidden="true"></i> <span v-html="item.start_time + ' - ' + item.end_time"></span></p>
                
                <p class="single-list__location"><i class="fa fa-map-marker" aria-hidden="true"></i> <span v-html="item.address"></span></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item'],
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: { 
        },
        computed: {
        },
    }
</script>

<style lang="scss" scoped>

@import '../../styles/variables.scss';

.single-list-item {
    h5 {
        font-size: 18px;
        line-height: 1.3;
        margin: 0;
        margin: 8px 0 12px;
        font-weight: bold;
    }
}

.single-list-item-container {
    padding: 24px;
    p {
        margin: 0;
        font-size: 14px;
        line-height: 1.3;
        padding-bottom: 8px;
    }
}

.card-content {
    background: $white;
    padding: 16px 24px;
    i {
        // color: $orange;
        margin-right: 8px;
    }
}

.single-list-item__image {
    height: 150px;
    width: 100%;
    img {
        object-fit: cover;
        display: block;
        width: 100%;
        height: 100%;
    }
}

.single-list__group,
.single-list__location
 {
    display: flex;
}

.single-list__location {
    i {
        margin-right: 15px;
    }
}

.single-list__group {
    i {
        margin-right: 12px;
    }
}




</style>
