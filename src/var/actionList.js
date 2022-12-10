/*
    actionList = actionCmdList + optional commands / states
*/

/*
    id: [name, type (0 = axis, 1 = button), description, [assignments]]
*/

/*
    assignments: {
        id,
        type, // 0 = axis, 1 = button, 2 = key
        gamepadIndex?,
        gamepadName?
    }
*/

export default {
    roll: ['Roll', 0, ''],
    pitch: ['Pitch', 0, ''],
    yaw: ['Yaw', 0, ''],
    throttle: ['Throttle', 0, ''],
    leftbrake: ['Left Brake', 0, '(It\'s an unstable action, check tutorial page for more information)'],
    rightbrake: ['Right Brake', 0, '(It\'s an unstable action, check tutorial page for more information)'],
    parkingbrakes: ['Parking Brakes', 1, 'Toggle parking brakes'],
    flapsdown: ['Flaps Down', 1, 'Decrement flaps'],
    flapsup: ['Flaps Up', 1, 'Increment flaps'],
    flapsfulldown: ['Flaps Full Down', 1, 'Set flaps full'],
    flapsfullup: ['Flaps Full Up', 1, 'Set flaps clean'],
    spoilers: ['Spoilers', 1, 'Switch between spoilers states (Off, Flight, Armed)'],
    landinggear: ['Landing Gear', 1, 'Toggle landing gear'],
    reversethrust: ['Reverse Thrust', 1, 'Toggle reverse thrust (It\'s an unstable action, check tutorial page for more information)'],
    elevatortrimup: ['Elevator Trim Up', 1, 'Trim elevator up'],
    elevatortrimdown: ['Elevator Trim Down', 1, 'Trim elevator down'],
    landinglights: ['Landing Lights', 1, 'Toggle landing lights'],
    strobelights: ['Strobe Lights', 1, 'Toggle strobe lights'],
    beaconlights: ['Beacon Lights', 1, 'Toggle beacon lights'],
    navlights: ['Nav Lights', 1, 'Toggle navigation lights'],
    nextcamera: ['Next Camera', 1, 'Switch to next camera'],
    prevcamera: ['Prev Camera', 1, 'Switch to previous camera'],
    cockpitcamera: ['Cockpit Camera', 1, 'Switch to cockpit camera'],
    virtualcockpitcamera: ['Virtual Cockpit Camera', 1, 'Switch to virtual cockpit camera'],
    followcamera: ['Follow Camera', 1, 'Switch to follow camera'],
    flybycamera: ['Fly By Camera', 1, 'Switch to fly by camera'],
    onboardcamera: ['Onboard Camera', 1, 'Switch to onboard camera'],
    towercamera: ['Tower Camera', 1, 'Switch to tower camera'],
    ap: ['Autopilot', 1, 'Toggle autopilot state'],
    fueldump: ['Fuel Dump', 1, 'Toggle fuel dump'],
    hud: ['HUD', 1, 'Switch between HUD states (Full, Minimal, Map, Disabled)'],
    pause: ['Pause', 1, 'Toggle game pause']
}