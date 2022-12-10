/*
    actionList = actionCmdList + optional commands / states
*/

export default {
    parkingbrakes: 'commands/ParkingBrakes',
    flapsdown: 'commands/FlapsDown',
    flapsup: 'commands/FlapsUp',
    flapsfulldown: 'commands/FlapsFullDown',
    flapsfullup: 'commands/FlapsFullUp',
    spoilers: 'commands/Spoilers',
    landinggear: 'commands/LandingGear',
    elevatortrimup: 'commands/ElevatorTrimUp',
    elevatortrimdown: 'commands/ElevatorTrimDown',
    landinglights: 'commands/LandingLights',
    strobelights: 'commands/StrobeLights',
    beaconlights: 'commands/BeaconLights',
    navlights: 'commands/NavLights',
    nextcamera: 'commands/NextCamera',
    prevcamera: 'commands/PrevCamera',
    cockpitcamera: 'commands/SetCockpitCamera',
    virtualcockpitcamera: 'commands/SetVirtualCockpitCameraCommand',
    followcamera: 'commands/SetFollowCameraCommand',
    flybycamera: 'commands/SetFlyByCamera',
    onboardcamera: 'commands/SetOnboardCameraCommand',
    towercamera: 'commands/SetTowerCameraCommand',
    ap: 'commands/Autopilot.Toggle',
    fueldump: 'commands/FuelDump',
    hud: 'commands/ToggleHUD',
    pause: 'commands/TogglePause'
}