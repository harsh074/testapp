# Production
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/MainActivity-release-unsigned.apk  askmonk
zipalign -v 4 platforms/android/ant-build/MainActivity-release-unsigned.apk askmonk.apk

# Development
#cordova build android
#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/MainActivity-debug.apk  askmonk
#zipalign -v 4 platforms/android/ant-build/MainActivity-debug.apk askmonk.apk