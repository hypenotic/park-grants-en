<template>
    <nav class="navbar green">
        <div class="navbar-brand">
            <div>
                <a><img src="https://parkpeople.ca/listings/custom/uploads/2018/01/TD_grants_white_nologos_nationalGrants_white_nologos.png" class="grants-logo"></a>
            </div>
            
        </div>
        <div class="lang">
            <!-- <router-link to="" class="lang">EN</router-link> -->
            <router-link to="https://parkpeople.ca/boursesdeparc" class="lang">FR</router-link>

            {{ lang }}
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu">
            <div class="navbar-end">
                <router-link to="/" class="navbar-item" exact>Home</router-link>
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

<style lag="scss" scoped>
.green {
    background-color: #067f1b;
}

.lang {
    color: white;
    margin: 1em;
}

.navbar-item {
    color: white;
}

.grants-logo {
    max-height: 55px;
    width: auto;
    margin-top: 3px;
    margin-left: 8px; 
}
</style>