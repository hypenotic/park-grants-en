<template>
  <div v-if="data != null">
    <section class="videos">
      <div class="overlay">
        <h1>
          Make something awesome happen in your park
        </h1>
        <router-link to="/grant-recipients" class="cta_button" exact>
          2020 Recipients
        </router-link>
        <!-- <a href="/parkgrants/grant-recipients" class="cta_button">
					Past Recipients
				</a> -->
      </div>
      <div class="hero" v-if="isMobile()">
        <iframe
          v-if="selectedVideo == 0"
          src="https://player.vimeo.com/video/374742599?background=1&loop=1&autoplay=0"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
        <iframe
          v-if="selectedVideo == 1"
          src="https://player.vimeo.com/video/374961083?background=1&loop=1&autoplay=0"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
        <iframe
          v-if="selectedVideo == 2"
          src="https://player.vimeo.com/video/374963755?background=1&loop=1&autoplay=0"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
      </div>
      <div class="hero" v-else>
        <iframe
          v-if="selectedVideo == 0"
          src="https://player.vimeo.com/video/374742599?background=1&loop=1"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
        <iframe
          v-if="selectedVideo == 1"
          src="https://player.vimeo.com/video/374961083?background=1&loop=1"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
        <iframe
          v-if="selectedVideo == 2"
          src="https://player.vimeo.com/video/374963755?background=1&loop=1"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
      </div>
    </section>
    <section class="section" v-if="data && data.hasOwnProperty('meta_box')">
      <div class="container">
        <h1 id="bird-anchor" v-html="data.meta_box._page_grant_heading"></h1>
        <div class="topContent" v-html="data.content.rendered"></div>
      </div>
    </section>

    <section class="event-templates container">
      <h3 v-html="data.meta_box._page_buckets_main_heading"></h3>
      <div
        class="four-column wow fadeInUp"
        data-wow-duration="1s"
        data-wow-delay="0.2s"
      >
        <div
          v-for="bucket in data.meta_box._page_buckets"
          :key="bucket.bucket_copy"
        >
          <h4 v-html="bucket._page_bucket_heading"></h4>
          <p v-html="bucket._page_bucket_copy"></p>
          <a
            :href="bucket._page_bucket_link"
            @click="downloadArea(bucket._page_bucket_heading)"
            >Download .zip file</a
          >
        </div>
      </div>
    </section>

    <section class="grant-illustration">
      <img
        src="https://parkpeople.ca/custom/uploads/2020/04/TD_PPgrants_isolation_webart.jpg"
        alt="Illustration"
      />
    </section>

    <!--
    <section class="grant-illustration">
      <div class="main-animation">
        <img
          src="https://parkpeople.ca/custom/uploads/2018/01/parkparadepeople_paradelayer.gif"
          alt="Parade animation"
        />
      </div>
      <div class="clouds"></div>
    </section>
	-->

    <section class="grants-newsletter container">
      <div class="container">
        <p>Want to stay up-to-date on Park People news?</p>
        <a class="button" href="http://eepurl.com/dx3BWX" target="_blank"
          >Get the Park People newsletter!</a
        >
      </div>
    </section>

    <section class="grant-sponsors container">
      <p>Made possible by a great collaboration:</p>
      <ul>
        <li
          v-for="sponsor in data.meta_box._page_grant_sponsors"
          :key="sponsor['_page_g_sponsor_img']"
        >
          <a :href="sponsor['_page_g_sponsor_link']" target="_blank"
            ><img :src="sponsor['_page_g_sponsor_img']" alt="logo"
          /></a>
        </li>
      </ul>
    </section>

    <app-related
      :title="data.meta_box._page_grant_resource_heading"
      :copy="data.meta_box._page_grant_resource_copy"
      :posts="relatedPosts"
    ></app-related>
  </div>
  <div v-else class="loading-panel">
    <div>
      <img
        src="https://parkpeople.ca/custom/uploads/2018/01/birdflying_pp_small.gif"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import RelatedList from "../components/related-resources/RelatedList.vue";
export default {
  components: {
    appRelated: RelatedList
  },
  props: ["name"],
  data() {
    return {
      data: null,
      relatedPosts: [],
      errors: [],
      loading: true,
      selectedVideo: 0,
      // videoLengths: [5,5,5],
      videoLengths: [72, 61, 65],
      time: 0
    };
  },
  filters: {
    removeHyphen(value) {
      return value.replace("-", " ");
    },
    capitalizeFirstLetter(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toUppercase(value) {
      return value.toUpperCase();
    },
    readMore(value, length, suffix) {
      if (value.length < length) return value;
      return value.substring(0, length) + suffix;
    },
    stripHTML(value) {
      return value.replace(/(<([^>]+)>)/gi, "");
    },
    toTitleCase(value) {
      return value.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  },
  methods: {
    downloadArea(name) {
      console.log("download event", name);
      this.$ga.event("download", "TD Grants Download", name, 1);
    },
    switchVideo(value) {
      this.selectedVideo = value;
    },
    isMobile() {
      return (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      );
    }
  },
  created() {
    axios
      .get("https://parkpeople.ca/wp-json/wp/v2/pages/17540?_embed")
      .then(response => {
        this.data = response.data;

        this.loading = false;

        axios
          .all([
            axios.get(
              "https://parkpeople.ca/wp-json/wp/v2/case-study/?_embed&categories=133&per_page=20"
            ),
            axios.get(
              "https://parkpeople.ca/wp-json/wp/v2/research/?_embed&categories=133&per_page=20"
            ),
            axios.get(
              "https://parkpeople.ca/wp-json/wp/v2/resource/?_embed&categories=133&per_page=20"
            )
          ])
          .then(
            axios.spread((response, response1, response2) => {
              // console.log(response.data)
              let allPosts = response.data.concat(
                response1.data,
                response2.data
              );
              // console.log('old', allPosts)
              allPosts.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
              });
              // console.log('sorted', allPosts)
              this.relatedPosts = allPosts;
            })
          )
          .catch(e => {
            console.log(e);
            this.errors.push(e);
          });
      })
      .catch(e => {
        console.log(e);
        this.errors.push(e);
      });
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/views/home.scss";
</style>
