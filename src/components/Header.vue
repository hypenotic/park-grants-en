<template>
    <nav v-if="scrolled == true" id="scrolling" class="navbar green">
        <div class="navbar-brand">
            <div>
                <a href="https://parkpeople.ca/parkgrants"><img src="https://parkpeople.ca/listings/custom/uploads/2018/01/TD_grants_white_nologos_nationalGrants_white_nologos.png" class="grants-logo"></a>
            </div>
        </div>

        <div class="lang">
            <a v-if="this.$route.path == '/faq'" href="https://parkpeople.ca/boursesdeparc/faq">FR</a>
            <a v-else href="https://parkpeople.ca/boursesdeparc">FR</a>
        </div>

         <div id="mobile-menu-trigger" v-on:click="showMobileMenu = !showMobileMenu">
            <i class="fa fa-bars" aria-hidden="true"></i>
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu" v-bind:class="{ 'menu-open': showMobileMenu }">
            <div class="navbar-end">
                <a href="https://parkpeople.ca" class="navbar-item">Home</a>
                <span class="navbar-item" v-on:click="showMobileMenu = !showMobileMenu" v-if="this.$route.path == '/faq'"><router-link to="/" exact>Grants</router-link></span>
                <span class="navbar-item" v-on:click="showMobileMenu = !showMobileMenu" v-if="this.$route.path == '/'"><router-link to="/faq"  exact>FAQ</router-link></span>
            </div>
        </div>
    </nav>
    <nav v-else class="navbar green">
        <div class="navbar-brand">
            <div>
                <a href="https://parkpeople.ca/parkgrants"><img src="https://parkpeople.ca/listings/custom/uploads/2018/01/TD_grants_white_nologos_nationalGrants_white_nologos.png" class="grants-logo"></a>
            </div>
        </div>

        <div class="lang">
            <a v-if="this.$route.path == '/faq'" href="https://parkpeople.ca/boursesdeparc/faq">FR</a>
            <a v-else href="https://parkpeople.ca/boursesdeparc">FR</a>
        </div>

         <div id="mobile-menu-trigger" v-on:click="showMobileMenu = !showMobileMenu">
            <i class="fa fa-bars" aria-hidden="true"></i>
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu" v-bind:class="{ 'menu-open': showMobileMenu }">
            <div class="navbar-end">
                <a href="https://parkpeople.ca" class="navbar-item">Home</a>
                <span class="navbar-item" v-on:click="showMobileMenu = !showMobileMenu" v-if="this.$route.path == '/faq'"><router-link to="/" exact>Grants</router-link></span>
                <span class="navbar-item" v-on:click="showMobileMenu = !showMobileMenu" v-if="this.$route.path == '/'"><router-link to="/faq"  exact>FAQ</router-link></span>
            </div>
        </div>
    </nav>
</template>

<script>
import { eventBus } from '../main.js';
export default {
    data() {
        return {
            id: this.$route.params.id,
            lang: '',
            showMobileMenu: false,
            scrolled: false
        }
    },
    methods: {
        handleScroll: function (event) {
            if (window.addEventListener){
                // console.log('A');
                // console.log(pageYOffset);
                if (window.pageYOffset > 20) {
                    this.scrolled = true;
                } else {
                    this.scrolled = false;	
                }
            } else if (window.attachEvent){
                // console.log('B');
                if (window.scrollY > 20) {
                    this.scrolled = true;
                } else {
                    this.scrolled = false;	
                }
            } else {
                if (window.pageYOffset > 20) {
                    // console.log('C');
                    this.scrolled = true;
                } else {
                    this.scrolled = false;	
                }
            }
        }
    },
    created: function () {
        // window.addEventListener('scroll', this.handleScroll);
        if (window.addEventListener){
            // console.log('Option 1');
            window.addEventListener('scroll', this.handleScroll);
        } else if (window.attachEvent){
            // console.log('Option 2');
            window.attachEvent('scroll', this.handleScroll);
        } else {
            // console.log('Option 3');
            jQuery(window).on('scroll', this.handleScroll);
            // console.log('IE');
        }
    },
    destroyed: function () {
        // window.removeEventListener('scroll', this.handleScroll);
        if (window.addEventListener){
            window.removeEventListener('scroll', this.handleScroll);
        } else if (window.attachEvent){
            window.detachEvent('scroll', this.handleScroll);
        } else {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
};
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';

.green {
    background-color: #067f1b;
}

nav#scrolling {
    @media #{$medium-and-down} {
		// display: block;
		position: fixed; 
        width: 100%;
		z-index: 6000;
    }
}

#mobile-menu-trigger {
	display: none;
	&:hover {
		cursor: pointer;
	}
	i {
		color: $white;
		font-size: 30px;
	}
	@media #{$medium-and-down} {
		display: block;
		position: fixed; 
		right: 30px;
		top: 15px;
		z-index: 5000000;
    }
	
}

.navbar {
    @media #{$medium-and-down} {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 5000;
    }
}

.navbar-brand {
    @media #{$medium-and-down} {
        display: inline-block;
    }
}

.navbar-menu {
    a {
        color: $white;
        &:hover {
            color: $blue;
            background: $white;
        }
    }
    span {
        &:hover {
            background: $white;
            color: $blue;
            a {
                color: $blue;
            }
        }
    }
}

.navbar-menu.menu-open {
    @media #{$medium-and-down} {
        position: absolute;
        display: inline-block;
        top: 55px;
        width: 100%;
        background:  #067f1b;
    }
}

.lang {
    display: flex;
    align-items: center;
    color: white;
    margin: 1em;
    @media #{$medium-and-down} {
        display: inline-block;
        margin: 0 0 0 16px;
    }
    a {
        color: white;
        &:hover {
            font-weight: bold;
        }
    }
}

.navbar-item {
    color: white;
}

.grants-logo {
    max-height: 50px;
    width: auto;
    margin-top: 3px;
    margin-left: 8px; 
    @media #{$large-and-up} {
		max-height: 70px;
        width: auto;
        margin-top: 3px;
        margin-left: 8px; 
	}
    @media #{$xlarge-and-up} {
		max-height: 80px;
        width: auto;
        margin-top: 3px;
        margin-left: 8px; 
	}
}
</style>