<template>
    <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
            <v-img class="shrink mr-2" contain src="./../assets/images/logo sq w.png" transition="scale-transition"
                width="45"/>
        </div>

        <v-spacer></v-spacer>

        <v-btn @click="$emit('changePage', 'main')" text>
            <span>Main</span>
        </v-btn>

        <v-btn @click="$emit('changePage', 'joysticks')" text>
            <span>Joysticks</span>
        </v-btn>

        <v-btn @click="$emit('changePage', 'tutorial')" text>
            <span>Tutorial</span>
        </v-btn>

        <v-btn href="https://en.map-flight.com" target="_blank" text>
            <span class="mr-2">Map Flight</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
    name: "NavBar"
}
</script>

<style>
.v-app-bar.v-app-bar--fixed {
    z-index: 10;
}
</style>