<template>
    <v-app>
        <NavBar @changePage="changePage"/>

        <v-main>
            <MainPage v-if="curPage === 'main'" :status="status" :errMsg="errMsg" @changePage="changePage" />
            <JoysticksPage v-if="curPage === 'joysticks'" :actionList="actionList" :joysticksList="joysticksList"
                :curPressedKey="curPressedKeyForJoysticksPage" @saveActionList="saveActionList" />
            <TutorialPage v-if="curPage === 'tutorial'" />
            <!-- <button @click="status = 0">status = 0</button>
            <button @click="status = 1">status = 1</button>
            <button @click="status = 2; errMsg = 'Please do not open 2 apps at the same time!'">status = 2</button> -->
        </v-main>
    </v-app>
</template>

<script>
import { ipcRenderer } from 'electron';
import NavBar from './components/NavBar';
// import pages
import MainPage from './components/pages/MainPage';
import JoysticksPage from './components/pages/JoysticksPage';
import TutorialPage from './components/pages/TutorialPage.vue';
// utils
import actionListFn from './utils/file/actionList';
import lastValCheck from './utils/action/lastValCheck';

export default {
    name: 'App',

    components: {
        NavBar,
        MainPage,
        JoysticksPage,
        TutorialPage
    },

    data: () => ({
        curPage: 'main',
        // 0 = connecting, 1 = connected, 2 = error
        status: 0,
        errMsg: '',
        actionList: {},
        joysticksList: [],
        curPressedKeyForJoysticksPage: null
    }),

    methods: {
        changePage(page) {
            this.curPage = page;
        },
        async getActionList() {
            const actionList = await actionListFn.get(),
                showAssignmentsList = new Set();

            for (let i in actionList) {
                const assignments = actionList[i][3];
                for (let a = 0; a < assignments.length; a++) {
                    for (let e = 0; e < this.joysticksList.length; e++) {
                        if (assignments[a].type <= 1 && assignments[a].gamepadName === this.joysticksList[e].name) {
                            assignments[a].gamepadIndex = e;
                            showAssignmentsList.add(assignments[a]);
                        }
                    }
                }
            }
            console.log(showAssignmentsList);
            for (let i in actionList) {
                const assignments = actionList[i][3];
                for (let a = 0; a < assignments.length; a++) {
                    if (assignments[a].type <= 1 && !showAssignmentsList.has(assignments[a])) {
                        assignments.splice(a, 1);
                    }
                }
            }
            this.actionList = actionList;
        },
        async saveActionList(action) {
            this.actionList[action.id][3] = action.assignmentList;
            await actionListFn.set(this.actionList);
        }
    },

    mounted() {
        window.addEventListener('keydown', e => {
            for (let i in this.actionList) {
                const assignments = this.actionList[i][3];
                for (let a = 0; a < assignments.length; a++) {
                    if (assignments[a].type === 2 && assignments[a].id === e.key) {
                        if (i === 'reversethrust') {
                            ipcRenderer.send("button operation", i, true);
                        } else {
                            ipcRenderer.send("button operation", i);
                        }
                    }
                }
            }

            this.curPressedKeyForJoysticksPage = null;
            this.$nextTick(() => {
                this.curPressedKeyForJoysticksPage = e.key;
            })
        })

        window.addEventListener('keyup', e => {
            for (let i in this.actionList) {
                const assignments = this.actionList[i][3];
                for (let a = 0; a < assignments.length; a++) {
                    if (assignments[a].type === 2 && assignments[a].id === e.key && i === 'reversethrust') {
                        ipcRenderer.send("button operation", i, false);
                    }
                }
            }
        })

        window.addEventListener("gamepadconnected", e => {
            const gamepad = e.gamepad;
            this.joysticksList.push({
                id: gamepad.index,
                name: gamepad.id,
                buttons: gamepad.buttons,
                axes: gamepad.axes
            })
            this.getActionList();
        })

        window.addEventListener("gamepaddisconnected", e => {
            const gamepad = e.gamepad;
            for (let i = 0; i < this.joysticksList.length; i++) {
                if (this.joysticksList[i].id === gamepad.index) {
                    this.joysticksList.splice(i, 1);
                }
            }
            this.getActionList();
        })

        setInterval(() => {
            const list = this.joysticksList;
            if (list.length === 0) return;
            const gamepads = navigator.getGamepads();
            if (gamepads === null) return;

            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] !== null) {
                    for (let a = 0; a < list.length; a++) {
                        if (list[a].id === gamepads[i].index) {
                            list[a].axes = gamepads[i].axes;
                            list[a].buttons = gamepads[i].buttons;
                        }
                    }
                }
            }

            for (let i = 0; i < list.length; i++) {
                for (let a in this.actionList) {
                    const assignments = this.actionList[a][3];
                    for (let e = 0; e < assignments.length; e++) {
                        if (assignments[e].type <= 1 && assignments[e].gamepadIndex === i) {
                            if (assignments[e].type === 0) {
                                // axes
                                if (lastValCheck(a, list[i].axes[assignments[e].id])) {
                                    ipcRenderer.send("axis operation", a, list[i].axes[assignments[e].id]);
                                }
                            } else {
                                // buttons
                                if (lastValCheck(a, list[i].buttons[assignments[e].id].pressed)) {
                                    ipcRenderer.send("button operation", a, list[i].buttons[assignments[e].id].pressed);
                                }
                            }
                        }
                    }
                }
            }
        }, 30)

        ipcRenderer.on('connected', () => {
            this.status = 1;
        })

        ipcRenderer.on('lose connection', () => {
            if (this.status === 2) return;
            this.status = 0;
        })

        ipcRenderer.on('connect error', (e, msg) => {
            this.status = 2;
            this.errMsg = msg;
        })

        ipcRenderer.on('change page', (e, page) => {
            this.curPage = page;
        })

        this.getActionList();
    }
}
</script>
