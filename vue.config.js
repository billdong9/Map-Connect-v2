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
                mac: {
                    icon: "build/icons/icon.icns"
                }
            }
        }
    }
})
