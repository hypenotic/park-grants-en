<template>
    <nav class="navbar green">
        <div class="navbar-brand">
            <div>
                <a href="https://parkpeople.ca/parkgrants"><img src="https://parkpeople.ca/listings/custom/uploads/2018/01/TD_grants_white_nologos_nationalGrants_white_nologos.png" class="grants-logo"></a>
            </div>
            
        </div>
        <div class="lang">
            <a v-if="this.$route.path == '/faq'" href="https://parkpeople.ca/boursesdeparc/faq">FR</a>
            <a v-else href="https://parkpeople.ca/boursesdeparc">FR</a>
            {{ lang }}
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu">
            <div class="navbar-end">
                <a class="navbar-item" href="https://parkpeople.ca">Home</a>
                <router-link v-if="this.$route.path == '/faq'" to="/" class="navbar-item" exact>Grants</router-link>
                <router-link to="/faq" class="navbar-item" exact>FAQs</router-link>
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
            lang: ''
        }
    },
};
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';

.green {
    background-color: #067f1b;
}

.lang {
    color: white;
    margin: 1em;
    display: flex;
    align-items: center;
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