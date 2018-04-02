<template>
	<div v-if="data != null">
		<section class="section" v-if="data && data.hasOwnProperty('meta_box')">
			<div class="container">
				<!-- <h1 id="bird-anchor" v-html="data.meta_box._page_grant_heading"></h1> -->
				<h1 id="bird-anchor">TD Park People Grants: Bringing People Together in City Parks</h1>

				<div class="topContent">
					<p>TD Park People Grants are helping community groups host over 160 great events in city parks across Canada.  We know that when we gather together in our parks people are happier, communities are more connected and cities thrive.</p>
				</div>

			</div>
		</section>

		<section class="map-section">
			<h2>TD Park People Events Across Canada</h2>

			<app-map></app-map>
		</section>

		<!-- <section class="grant-recipients">
			<h3>Grant Recipients</h3>
		</section> -->
				
		<section class="recipients">
			<div class="align-center"><router-link class="cta_button" to="/recipients">See all grant recipients!</router-link></div>
		</section>

		<section class="event-templates">
			<h3>Spread the word about your community events in city parks</h3>
			<div class="three-column">
				<div>
					<h4>Posters and Flyers</h4>
					<p>Editable PDF posters you can use to make your event shine all around the neighbourhood.</p>
					<a href="#">Download</a>
				</div>
				<div>
					<h4>Social Media Graphics</h4>
					<p>Get your Twitter, Facebook, and Instagram graphics ready to give your event the social media fame it deserves.</p>
					<a href="#">Download</a>
				</div>
				<div>
					<h4>Wordmark and Usage Guidelines</h4>
					<p>Making your own poster? Grab the logo version that best fits your design</p>
					<a href="#">Download</a>
				</div>
			</div>

		</section>

		<section class="grant-illustration">
			<div class="main-animation">
				<img src="https://parkpeople.ca/listings/custom/uploads/2018/01/parkparadepeople_paradelayer.gif" alt="Parade animation">
			</div>
			<div class="clouds">
			</div>
		</section>

		<section class="grants-newsletter">
			<div class="container">
				<p>Want to stay up-to-date on Park People news?</p>
				<a class="button" href="http://parkpeople.us2.list-manage.com/subscribe?u=ba963c8c64482c0ad756245c3&id=efc9b053b8" target="_blank">Get the Park People newsletter!</a>
			</div>
		</section>
		<section class="grant-sponsors">
			<p>Made possible by a great collaboration:</p>
			<ul>
				<li v-for="sponsor in data.meta_box._page_grant_sponsors" :key="sponsor['_page_g_sponsor_img']">
					<img :src="sponsor['_page_g_sponsor_img']" alt="logo">
				</li>
			</ul>
		</section>
		<section class="related-resources" id="related-resources-jump">
			<h3 v-html="data.meta_box._page_grant_resource_heading"></h3>
			<div class="related-resources-copy" v-html="data.meta_box._page_grant_resource_copy"></div>
			<!-- <div class="related-resources-copy"><strong><a href="http://parkpeople.hypenotic.com/">Or browse our entire resource section.</a></strong></div> -->
			<div class="wide-container">
				<div class="columns is-multiline">
					<div class="column is-one-quarter" v-for="related in relatedPosts" :key="related.title.rendered">
						<div class="card">
							<div class="card-image">
								<figure class="image is-2by1">
									<img v-if="related._embedded['wp:featuredmedia'] != undefined" :src="related._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url">
								</figure>
							</div>
							<div class="card-content">
								<div class="content">
									<small style="font-family: 'Dosis';font-size: 12px;"> {{ related.type | removeHyphen | toTitleCase }}</small>

									<a :href="'https://parkpeople.ca/resources/en/'+related.type + '/' + related.id + '/' + related.slug"><h4 v-html="related.title.rendered"></h4></a>
									<div v-html="$options.filters.readMore(related.excerpt.rendered, 100, '...')"></div>
									<div v-if="related.pure_taxonomies.activity" class="activity-list-container">
										<strong>Do in parks</strong>: <span v-for="tax in related.pure_taxonomies.activity" :key="tax.name">{{ tax.name  }}</span>
									</div>
									<div v-if="related.pure_taxonomies.learn" class="activity-list-container">
										<strong>Know about parks:</strong> <span v-for="tax in related.pure_taxonomies.learn" :key="tax.name">{{ tax.name }}</span>
									</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div v-else class="loading-panel">
		<div>
			<img src="https://parkpeople.ca/listings/custom/uploads/2018/01/birdflying_pp_small.gif" alt="">
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Map from '../components/Map.vue';
export default {
	components: {
        appMap: Map
    },
	props: ['name'],
	data() {
		return {
			data: null,
			relatedPosts: [],
			errors: [],
			loading: true,
		};
	},
	filters: {
		removeHyphen(value){
			return value.replace("-", ' ');
		},
		capitalizeFirstLetter(value) {
			return value.charAt(0).toUpperCase() + value.slice(1);
		},
		toUppercase(value) {
			return value.toUpperCase();
		},
		readMore(value, length, suffix) {
			if (value.length < length)
			return value;	
			return value.substring(0, length) + suffix;
		},
		stripHTML(value) {
			return value.replace(/(<([^>]+)>)/ig,"");
		},
		toTitleCase(value) {
    		return value.replace(/\w\S*/g, (txt) => {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		},
	},
	computed: {

    },
	methods: {

	},
	mounted() {

	},
	created() {
		console.log('hi')
		axios.get('https://parkpeople.ca/listings/wp-json/wp/v2/pages/630?_embed')
		.then(response => {
            console.log(response.data)
			this.data = response.data
			
			this.loading = false

			axios.all([
				axios.get('https://parkpeople.ca/listings/wp-json/wp/v2/case-study/?_embed&categories=133&per_page=20'),
				axios.get('https://parkpeople.ca/listings/wp-json/wp/v2/research/?_embed&categories=133&per_page=20'),
				axios.get('https://parkpeople.ca/listings/wp-json/wp/v2/resource/?_embed&categories=133&per_page=20')
			])
			.then(axios.spread((response, response1, response2) => {
				// console.log(response.data)
				let allPosts  = response.data.concat(response1.data, response2.data);
				// console.log('old', allPosts)
				allPosts.sort(function(a,b){
					return new Date(b.date) - new Date(a.date)
				})	
				// console.log('sorted', allPosts)
				this.relatedPosts = allPosts
			}))
			.catch(e => {
				console.log(e)
				this.errors.push(e)
			})

		})
		.catch(e => {
			console.log(e)
			this.errors.push(e)
		})
	},
};
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';
@import '../styles/views/home.scss';

</style>