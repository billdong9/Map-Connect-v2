const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "Map Connect",
                win: {
                    icon: "build/icons/icon.ico"
                },
                // MAS DEV
                // mac: {
                //     icon: "build/icons/icon.icns",
                //     target: "mas-dev",
                //     provisioningProfile: "build/mas/Map_Connect_Development.provisionprofile",
                //     entitlements: "build/mas/entitlements.mac.plist",
                //     entitlementsInherit: "build/mas/entitlements.mac.inherit.plist",
                //     hardenedRuntime: false,
                //     gatekeeperAssess: false,
                //     identity: null
                // },
                // MAS DIS
                mac: {
                    icon: "build/icons/icon.icns",
                    target: "mas",
                    provisioningProfile: "build/mas/Map_Connect_Distribution.provisionprofile",
                    entitlements: "build/mas/entitlements.mac.plist",
                    entitlementsInherit: "build/mas/entitlements.mac.inherit.plist",
                    hardenedRuntime: false,
                    gatekeeperAssess: false,
                    identity: null
                },
                // DARWIN
                // mac: {
                //     icon: "build/icons/icon.icns",
                //     target: [
                //         {
                //             target: "dmg",
                //             arch: "x64"
                //         }
                //     ]
                // }
            }
        }
    }
})
