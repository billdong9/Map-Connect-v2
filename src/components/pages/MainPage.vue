<template>
    <v-container style="user-select: none;">
        <v-snackbar color="success" v-model="refreshManifestSnackbar">
            Manifest is refreshed.

            <template v-slot:action="{ attrs }">
                <v-btn color="white" icon v-bind="attrs" @click="refreshManifestSnackbar = false">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-row class="mt-10 mb-5" style="position: relative;">
            <v-col>
                <v-img src="./../../assets/images/logo sq.png" contain height="200" />
            </v-col>
            <v-btn @click="refreshManifest" :disabled="status !== 1 || !isGettingManifestDone"
                style="position: absolute; top: 0; right: 15px;" color="success" depressed>
                <v-icon left>
                    mdi-refresh
                </v-icon>

                Refresh manifest
            </v-btn>
        </v-row>
        <v-row class="mb-16">
            <!-- connecting -->
            <v-col v-if="status === 0" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <span style="position: relative; top: 9px; left: 10px;" class="display-1">
                    Connecting...
                </span>
            </v-col>

            <!-- connected -->
            <v-col v-if="status === 1" class="text-center">
                <v-avatar color="teal" size="32"></v-avatar>
                <span style="position: relative; top: 9px; left: 10px;" class="display-1">
                    Connected
                </span>
            </v-col>

            <!-- error -->
            <v-col v-if="status === 2" class="text-center">
                <v-avatar color="red" size="32"></v-avatar>
                <span style="position: relative; top: 9px; left: 10px;" class="display-1">
                    An error occurred
                </span>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <!-- connecting -->
            <v-col v-if="status === 0">
                <v-alert color="primary" dark icon="mdi-information" border="left" prominent>
                    Map Connect is trying to establish a connection with Infinite Flight, please make sure the two
                    devices are under the same WIFI network, and have "Enable Infinite Flight Connect" checked in
                    Infinite Flight settings.
                    <br>
                    <br>
                    <b>If this is your first time using Map Connect v2, check out our tutorial <span
                            style="color: #80DEEA; cursor: pointer;"
                            @click="$emit('changePage', 'tutorial')">HERE</span></b>
                </v-alert>
            </v-col>

            <!-- connected -->
            <v-col v-if="status === 1">
                <v-alert color="teal" dark icon="mdi-check" border="left" prominent>
                    Congratulations, Map Connect has successfully connected to Infinite Flight!
                    <br>
                    <br>
                    <b>During the flight, please keep the focus of the computer in the Map Connect window and do not
                        close the window.</b>
                </v-alert>
            </v-col>

            <!-- error -->
            <v-col v-if="status === 2">
                <v-alert color="red" dark icon="mdi-close" border="left" prominent>
                    An error has occurred. The error message is as follows:
                    <br>
                    <br>
                    <b>{{ errMsg }}</b>
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
const ipcRenderer = window.ipcRenderer;

export default {
    name: "MainPage",
    props: ['status', 'errMsg'],

    data: () => ({
        isGettingManifestDone: true,
        refreshManifestSnackbar: false
    }),

    methods: {
        refreshManifest() {
            this.isGettingManifestDone = false;
            ipcRenderer.send('refreshManifest');
        },
        gettingManifestDone() {
            this.isGettingManifestDone = true;
            this.refreshManifestSnackbar = true;
        }
    }
}
</script>