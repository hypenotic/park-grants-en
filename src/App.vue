<template>
    <div>
    
        <app-header></app-header>
        <transition name="fade">
            <router-view :key="$route.fullPath"></router-view>
        </transition>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    import Footer from './components/Footer.vue';
    export default {
    components: {
        appHeader: Header,
        appFooter: Footer
    }
}
</script>

<style lang="scss">

// Import Bulma's core
@import "~bulma/sass/utilities/_all";
@import url('https://fonts.googleapis.com/css?family=Dosis:400,700,800|Comfortaa|Merriweather');
// Import Variables
@import './styles/variables.scss';

$family-cursive: "Comfortaa", cursive;
$family-sanserif: "Dosis", sans-serif;
$serif: "Merriweather", serif;

html, body {
    font-size: 18px;
    line-height: 26px;
    font-family: $family-cursive;
    color: $body-color;
}

a {
    color: $blue;
}

p {
    font-size: 1rem;
    line-height: 1.5rem;
    margin-bottom: 1.5rem;
    color: $body-color;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
    margin-bottom: 1rem;
    color: $body-color;
}

h1 {
    font-size: 5.063rem;
    margin-bottom: 0;
}

h2 {
    font-size: 2.375rem;
    @media #{$large-and-up} {
        font-size: 3.375rem;
    }
}

h3 {
    font-size: 2.75rem;
}

h4 {
    font-size: 2.25rem;
}

h5 {
    font-size: 1.833rem;
}

h6 {
    font-size: 1.222rem;
    font-weight: bold;
}

small {
    font-size: 0.815rem;
}

.fade-enter-active {
    transition: opacity .5s
}

.fade-leave-active {
    transition: opacity .5s
}

.wfs-loading {
    visibility: hidden;
}

.wfs-active, .wf-inactive {
    visibility: visible;
}

.card .content {
    p {
		font-size: 0.8rem;
		line-height: 1.3rem;
	}
}

.card__learn-list,
.card__activity-list,
.activity-list-container {
    font-family: $family-sanserif;
}

ol.resource__bullets {
	>li {
		ul, ol {
			list-style-type: disc;
			margin-left: 24px;
            padding-left: 10px;
            margin-top: 16px;
            li:not(:last-child) {
                margin-bottom: 8px;
            }
		}
	}
}

.resource__takeaways {
    h4 {
        font-size: 1.3rem;
        line-height: 1.8rem;
        font-weight: bold;
    }
}

.resource__excerpt p {
	font-size: 1.2rem;
	line-height: 1.8rem;
}

.case-study__context {
    blockquote{
        padding-left: 40px;
        padding-right: 15%;
        p {
            font-family: $serif;
            color: $green;
            font-size: 1.3rem;
            line-height: 1.8rem;
            font-style: italic;
        }
    }
}

.quote {
    max-width: 75%;
    margin: 0 auto;
    cite {
        display: block;
        text-align: right;
        margin-top: 8px;
    }
}

.full-width-quote {
    font-family: $serif;
    color: $green;
    font-size: 1.5rem;
    line-height: 2.2rem;
    font-style: italic;
    position: relative;
    &:after {
        content: '“';
        position: absolute;
        top: 0;
        left: -20px;
    }
}

// Grants

.topContent {
    margin: 32px 0;
    font-size: 1.2rem;
    p {
        font-size: 1.2rem;
        line-height: 1.5;
    }
    a {
        border-bottom: 1px solid $blue;
        &:hover {
            color: $blue;
            font-weight: bold;
        }
    }
}

.eligibility {
    a {
        border-bottom: 1px solid $blue;
        &:hover {
            color: $blue;
            font-weight: bold;
        }
    }
}


.more-info {
    text-align: center;
    p {
		font-size: 1rem;
        line-height: 1.5;
        @media #{$large-and-up} {
			font-size: 1.2rem;
            line-height: 1.7;
		}
    }
    a {
        border-bottom: 1px solid $blue;
        &:hover {
            color: $blue;
            font-weight: bold;
        }
    }
}

// Newsletter 
.mailchimp-form-container {
    #MERGE0{
        border: 2px dashed rgb(17, 116, 191) !important;
        min-width: 400px;
        // max-width: 300px;
        padding: 2px 16px;
        border-radius: 8px;
        min-height: 45px;
        font-size: 0.8rem;
        font-family: $family-cursive;
        background-color: rgb(242, 248, 252);
        &:focus,
        &:active {
            background-color: $white;
        }
    }   
    #mc-embedded-subscribe {
        border-radius: 50px;
        background-color: $blue;
        color: $white;
        box-shadow: none;
        border: 2px solid $blue;
        min-height: 45px;
        padding: 0 42px;
        font-family: $family-sanserif;
        font-weight: bold;
        margin-left: 16px;
        border: 2px solid $blue;
        &:hover {
            border: 2px solid $blue;
            color: $blue;
            background: $white;
        }
    }
}

// Footer
footer {
    font-size: 0.8rem;
    p, ul, li {
        font-size: 0.8rem;
    }
}
</style>