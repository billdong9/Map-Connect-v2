const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: false,
            preload: 'src/preload.js',
            chainWebpackRendererProcess: (config) => {
                config.target("web");
            },
            builderOptions: {
                appId: "com.map-flight.mapconnect",
                productName: "Map Connect",
                buildVersion: "1.3",
                win: {
                    icon: "build/icons/icon.ico"
                },
                // MAS DEV
                // mac: {
                //     icon: "build/icons/icon.icns",
                //     target: [
                //         {
                //             target: "mas-dev",
                //             arch: "x64"
                //         }
                //     ],
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
                    target: [
                        {
                            target: "mas",
                            arch: "x64"
                        }
                    ],
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
