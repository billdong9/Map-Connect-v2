<template>
    <v-container style="user-select: none;">
        <v-row class="mt-5">
            <v-col>
                <span class="text-h5">Joysticks:</span>
            </v-col>
        </v-row>
        <v-row v-if="joysticksList.length === 0">
            <v-col>
                <v-alert dense border="left" type="warning">
                    No joystick recognized
                </v-alert>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col v-for="(val, i) in joysticksList" :key="val.id">
                <v-card color="#385F73" dark>
                    <v-card-title class="text-h5">
                        Joystick {{ i + 1 }}
                    </v-card-title>
                    <v-card-subtitle>{{ val.name }}</v-card-subtitle>

                    <v-list color="#385F73" dense>
                        <v-list-group no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>AXES</v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item v-for="(axesVal, axesIndex) in val.axes" :key="axesIndex">
                                <v-list-item-content>
                                    <v-list-item-title>Axis {{ axesIndex }}: {{ axesVal }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>

                    <v-list color="#385F73" dense>
                        <v-list-group no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>BUTTONS</v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item v-for="(btnVal, btnIndex) in val.buttons" :key="btnIndex">
                                <v-list-item-content>
                                    <v-list-item-title>Button {{ btnIndex }}:
                                        {{ btnVal.pressed ? 'Pressed' : 'Not pressed' }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <span class="text-h5">Action:</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-list-item two-line v-for="(action, id) in actionList" :key="id">
                    <v-list-item-icon>
                        <v-icon v-text="action[1] === 0 ? 'mdi-axis-arrow' : 'mdi-button-pointer'"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ action[0] }}</v-list-item-title>
                        <v-list-item-subtitle>{{ getActionSubtitle(action[2], action[3]) }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn depressed color="info" @click="showSelectMenu($event, id, action)">
                            Select
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-col>
        </v-row>
        <v-menu v-model="isMenuShow" :position-x="menu.x" :position-y="menu.y" absolute offset-y :nudge-width="300"
            :close-on-content-click="false">
            <v-card style="user-select: none;">
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon v-text="menu.actionType === 0 ? 'mdi-axis-arrow' : 'mdi-button-pointer'"></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ menu.actionName }}</v-list-item-title>
                            <v-list-item-subtitle>{{ menu.actionType === 0 ? 'Axis' : 'Button' }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                <b style="color: blue;" v-if="menu.isSelectingKey">Please click any key on the
                                    keyboard...</b>
                                <b style="color: blue;" v-else-if="menu.isSelectingButton">Please click any button on
                                    the
                                    joystick...</b>
                                <b style="color: blue;" v-else-if="menu.isSelectingAxis">Please move any axis on the
                                    joystick...</b>
                                <b style="color: red;" v-else-if="menu.assignmentList.length === 0">No {{
                                        menu.actionType
                                            === 0 ? 'axes' : 'buttons'
                                }}{{ menu.actionType === 1 ? ' or keys' : '' }} are assigned to this
                                    action</b>
                                <b v-else>Keys and {{ menu.actionType === 0 ? 'axes' : 'buttons' }} list:</b>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-for="i in menu.assignmentList" :key="i.id">
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ i.id.toString().toUpperCase() }} ({{ getAssignmentTypeReadable(i) }})
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn @click="deleteThisAssignment(i.id)" icon>
                                <v-icon color="red lighten-1">mdi-close</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="indigo" outlined @click="menu.actionType === 0 ? selectAxis() : selectButton()">
                        <span v-if="menu.isSelectingAxis || menu.isSelectingButton">Stop selecting {{ menu.actionType
                                === 0 ? 'axis' : 'button'
                        }}</span>
                        <span v-else>Select {{ menu.actionType === 0 ? 'axis' : 'button' }}</span>
                    </v-btn>
                    <v-btn color="indigo" outlined @click="selectKey" v-if="menu.actionType === 1">
                        <span v-if="menu.isSelectingKey">Stop selecting key</span>
                        <span v-else>Select key</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
        <v-snackbar color="red" v-model="menu.isMsgShow" :timeout="-1">
            {{ this.menu.msg }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="menu.isMsgShow = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
export default {
    name: "JoysticksPage",
    /* joysticksList: [{
        id,
        name,
        buttons,
        axes
    }] */
    props: ["actionList", "curPressedKey", "joysticksList"],

    data: () => ({
        isMenuShow: false,
        menu: {
            x: 0,
            y: 0,
            actionName: '',
            actionType: 0,
            actionId: '',
            isSelectingButton: false,
            isSelectingAxis: false,
            isSelectingKey: false,
            /* [{
                id,
                type, // 0 = axis, 1 = button, 2 = key
                gamepadIndex?,
                gamepadName?
            }] */
            assignmentList: [],
            isMsgShow: false,
            msg: ''
        },
        joystickInterval: 0,
        oldJoysticksAxesList: []
    }),

    methods: {
        showSelectMenu(e, id, action) {
            e.preventDefault()
            this.isMenuShow = false;
            this.menu.x = e.clientX;
            this.menu.y = e.clientY;
            this.menu.actionName = action[0];
            this.menu.actionType = action[1];
            this.menu.actionId = id;
            this.menu.assignmentList = action[3];
            this.$nextTick(() => {
                this.isMenuShow = true;
            })
        },
        selectKey() {
            this.menu.isSelectingButton = false;
            this.menu.isSelectingAxis = false;

            if (this.menu.isSelectingKey) {
                this.menu.isSelectingKey = false;
            } else {
                this.menu.isSelectingKey = true;
            }
        },
        selectAxis() {
            this.menu.isSelectingButton = false;
            this.menu.isSelectingKey = false;

            if (this.menu.isSelectingAxis) {
                this.menu.isSelectingAxis = false;
            } else {
                this.menu.isSelectingAxis = true;
            }
        },
        selectButton() {
            this.menu.isSelectingAxis = false;
            this.menu.isSelectingKey = false;

            if (this.menu.isSelectingButton) {
                this.menu.isSelectingButton = false;
            } else {
                this.menu.isSelectingButton = true;
            }
        },
        checkPressedKey() {
            const list = this.menu.assignmentList;
            if (list.length >= 4) {
                this.menu.msg = 'This action can be assigned up to 4 keys and buttons';
                return false;
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === this.curPressedKey && list[i].type === 2) {
                    this.menu.msg = 'You have already added this key';
                    return false;
                }
            }
            return true;
        },
        checkPressedBtn(id, gamepadIndex, gamepadName) {
            const list = this.menu.assignmentList;
            if (list.length >= 4) {
                this.menu.msg = 'This action can be assigned up to 4 keys and buttons';
                return false;
            }
            for (let i = 0; i < list.length; i++) {
                if ((list[i].gamepadName === gamepadName || list[i].gamepadIndex === gamepadIndex) && list[i].id === id && list[i].type === 1) {
                    this.menu.msg = 'You have already added this button';
                    return false;
                }
            }
            return true;
        },
        checkMovedAxis() {
            const list = this.menu.assignmentList;
            if (list.length >= 1) {
                this.menu.msg = 'This action can be assigned at most one axis';
                return false;
            }
            return true;
        },
        getActionSubtitle(desc, assignments) {
            let firstHalf = desc, secondHalf = '';
            if (assignments.length !== 0) {
                if (desc !== '') {
                    secondHalf = ' - ';
                }
                for (let i = 0; i < assignments.length; i++) {
                    if (i !== 0) {
                        secondHalf += ', ';
                    }
                    secondHalf += `${assignments[i].id.toString().toUpperCase()} (${this.getAssignmentTypeReadable(assignments[i])})`
                }
            }
            return firstHalf + secondHalf;
        },
        getAssignmentTypeReadable(i) {
            switch (i.type) {
                case 0:
                    return 'Joystick ' + (i.gamepadIndex + 1) + ' Axis';
                case 1:
                    return 'Joystick ' + (i.gamepadIndex + 1) + ' Button';
                default:
                    return 'Key';
            }
        },
        deleteThisAssignment(id) {
            const list = this.menu.assignmentList;
            console.log(list)
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    list.splice(i, 1);
                    this.$emit('saveActionList', {
                        id: this.menu.actionId,
                        assignmentList: this.menu.assignmentList
                    })
                    return;
                }
            }

        }
    },

    watch: {
        isMenuShow() {
            this.menu.isSelectingButton = false;
            this.menu.isSelectingAxis = false;
            this.menu.isSelectingKey = false;
        },
        curPressedKey() {
            if (!this.curPressedKey || !this.menu.isSelectingKey) return;
            console.log(this.curPressedKey)

            if (this.checkPressedKey()) {
                this.menu.assignmentList.push({
                    id: this.curPressedKey,
                    type: 2
                })
                this.$emit('saveActionList', {
                    id: this.menu.actionId,
                    assignmentList: this.menu.assignmentList
                })
                this.menu.isSelectingButton = false;
                this.menu.isSelectingAxis = false;
                this.menu.isSelectingKey = false;
            } else {
                this.menu.isMsgShow = true;
            }
        }
    },

    mounted() {
        this.joystickInterval = setInterval(() => {
            if (!this.menu.isSelectingAxis && !this.menu.isSelectingButton) return;
            const list = this.joysticksList;

            // selecting button
            if (this.menu.isSelectingButton) {
                for (let i = 0; i < list.length; i++) {
                    const buttons = list[i].buttons;
                    for (let a = 0; a < buttons.length; a++) {
                        if (buttons[a].pressed) {
                            if (this.checkPressedBtn(a, list[i].id, list[i].name)) {
                                this.menu.assignmentList.push({
                                    id: a,
                                    type: 1,
                                    gamepadIndex: i,
                                    gamepadName: list[i].name
                                })
                                this.$emit('saveActionList', {
                                    id: this.menu.actionId,
                                    assignmentList: this.menu.assignmentList
                                })
                                this.menu.isSelectingButton = false;
                                this.menu.isSelectingAxis = false;
                                this.menu.isSelectingKey = false;
                            } else {
                                this.menu.isMsgShow = true;
                            }
                        }
                    }
                }
                return;
            }

            // selecting axis
            for (let i = 0; i < list.length; i++) {
                const axes = list[i].axes;
                for (let a = 0; a < axes.length; a++) {
                    if (this.oldJoysticksAxesList[i] === null || this.oldJoysticksAxesList[i] === undefined) {
                        this.oldJoysticksAxesList[i] = [];
                    }
                    if (this.oldJoysticksAxesList[i][a] === null || this.oldJoysticksAxesList[i][a] === undefined) {
                        this.oldJoysticksAxesList[i][a] = axes[a];
                    }
                    if (Math.abs(axes[a] - this.oldJoysticksAxesList[i][a]) >= 0.4) {
                        if (this.checkMovedAxis()) {
                            this.menu.assignmentList.push({
                                id: a,
                                type: 0,
                                gamepadIndex: i,
                                gamepadName: list[i].name
                            })
                            this.$emit('saveActionList', {
                                id: this.menu.actionId,
                                assignmentList: this.menu.assignmentList
                            })
                            this.menu.isSelectingButton = false;
                            this.menu.isSelectingAxis = false;
                            this.menu.isSelectingKey = false;
                            this.oldJoysticksAxesList = [];
                            return;
                        } else {
                            this.menu.isMsgShow = true;
                        }
                    }
                    this.oldJoysticksAxesList[i][a] = axes[a];
                }
            }

        }, 100)
    },

    beforeDestroy() {
        clearInterval(this.joystickInterval);
        this.joystickInterval = 0;
    }
}
</script>