<template>
    <v-dialog v-model="show" width="600" persistent>
        <v-card class="update-dialog-card" style="user-select: none;">
            <v-card-title class="text-h5">
                Update notice - {{ version }}
            </v-card-title>

            <v-card-text>
                <p>A new Map Connect version has been released, out of respect for your privacy, we will not force you
                    to update to the new version.</p>
                <p>However, we still recommend you to update, because the new version usually contains bug fixes and
                    some new features.</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="red" elevation="0" @click="ignoreThisVersion">
                    Ignore
                </v-btn>
                <v-btn text elevation="0" @click="close">
                    Remind me later
                </v-btn>
                <v-btn color="primary" elevation="0" href="https://github.com/18510047382/Map-Connect-v2/releases" target="_blank" @click="close">
                    Download
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import configFileFn from './../../utils/file/config';

export default {
    name: "UpdateDialog",
    data: () => ({
        show: false,
        version: '',
        config: {}
    }),
    methods: {
        open(version) {
            this.version = version;
            this.show = true;
        },
        close() {
            this.show = false;
        },
        ignoreThisVersion() {
            this.close();
            this.config.ignoreUpdate = true;
            this.config.ignoreUpdateVersion = this.version;
            configFileFn.set(this.config);
        }
    }
}
</script>