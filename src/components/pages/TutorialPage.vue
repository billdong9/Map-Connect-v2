<template>
    <v-container style="user-select: none;">
        <v-row class="mt-5">
            <v-col>
                <p class="text-h5">Tutorial</p>
                <p><a href="https://community.infiniteflight.com/t/map-connect-v2-official-tutorial/706420/1" target="_blank">Open the official Map Connect tutorial in your browser <v-icon x-small>mdi-open-in-new</v-icon></a></p>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col>
                <span class="text-h5">Frequently asked questions</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-alert color="cyan" elevation="2" colored-border icon="mdi-help-circle-outline" border="left">
                    <p><b>I have used Map Connect v1 before, do I still need to go through the tutorial?</b></p>
                    <p>Yes. Because the way to use Map Connect v2 is completely different from v1.</p>
                </v-alert>
            </v-col>
            <v-col>
                <v-alert color="cyan" elevation="2" colored-border icon="mdi-help-circle-outline" border="left">
                    <p><b>How do I report a problem (BUG)?</b></p>
                    <p>You can send an email to admin@map-flight.com to report the problem to us. If you are a
                        developer, you can submit an issue in our <a
                            href="https://github.com/18510047382/Map-Connect-v2" target="_blank">Github repository</a>.
                    </p>
                </v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-alert color="cyan" elevation="2" colored-border icon="mdi-help-circle-outline" border="left">
                    <p><b>What is an "unstable action"?</b></p>
                    <p>Whenever you start a new flight, you need to click the "Refresh Manifest" button on the Main page for the unstable actions to work.</p>
                    <p>After the refresh is complete, We recommend that you double check if these actions work properly before takeoff.</p>
                </v-alert>
            </v-col>
            <v-col>
                <v-alert color="cyan" elevation="2" colored-border icon="mdi-help-circle-outline" border="left">
                    <p><b>The game doesn't respond to my actions</b></p>
                    <p>Please go through each step of the tutorial carefully to make sure all your settings are correct.
                        <b>Many people have this problem because they have the incorrect settings! ! !</b> If you
                        confirm that your settings are all correct, you can report the problem to us.</p>
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "TutorialPage"
}
</script>