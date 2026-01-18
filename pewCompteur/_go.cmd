//suppose une connexion adb installée
call gradlew assembleDebug
call gradlew installDebug
call adb shell am start -n com.pewpew.pewcompteur/.MainActivity