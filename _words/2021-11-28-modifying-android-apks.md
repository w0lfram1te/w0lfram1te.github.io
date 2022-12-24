---
title: Modifying Android APKs
date_created: 2021-11-28
date_updated: 
metadata: research
---
# Modifying Android APKs

In the future, I'll be writing about pentesting Android applications. For now I thought it would be beneficial to first discuss modifying APK files for whatever reason - be it bypassing certificate pinning, root-checks, virtualization checks, or logic bypasses. 

This post will also serve as a way to force myself to learn about the basics of Android development. The more familiarity I build with the ecosystem, in theory, the easier it should be to conduct pentests on it and to reverse engineer it.

## Hello, (World) Android

Since discussing Android pentesting and reverse engineering would inevitably require targets for practice and for demonstration purposes, I thought it would be safer to build the app and add the security features to be bypassed myself.

We first need an APK to test with, so the following section will be me figuring out how to compile a simple app using Android Studio and installing it on an Android Virtual Machine for testing.

I downloaded Android Studio [here](https://developer.android.com/studio/install). Afterwards, I Installed the following dependencies and extracted the application.

```bash
$ sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
```

```bash
$ sudo tar -xzvf android-studio-*.tar.gz -C /opt/
$ sudo /opt/android-studio/bin/studio.sh
```

From there, I created a blank project based off of Java (other option was Kotlin) and opened the MainActivity file. Conveniently it already had all the components that I needed so I moved on to compiling the project. 
![](_media/001-android-studio-main-activity.png)

Before allowing me to compile it, I needed to accept the license and download the package for the `Android SDK Build Tools` and `Google Play Licensing Library` in `Tools > SDK Manager > SDK Tools`.
![](_media/001-android-studio-sdk-manager.png)

I went to `Build > Build Bundle(s) / APK(s) > Build APK(s)` to generate the project APK. Found the compilied APK at `PROJECT_FOLDER/app/build/outputs/apk/debug/app-debug.apk`. 

This will then be installed on an Android device using ADB. I'll be discussing the creation of an Android VM in another post.

```bash
adb install app-debug.apk
```

![](_media/001-hello-world.png)

## Modifying the APK

Now that we have an application that we can play around with, time to proceed to the meat of the post. For the purposes of the post, we'll be attempting to replace a value in the APK. Consider the situation where a user only has a copy of the APK installed on the device and nothing else.

We can pull the APK to our testing device by searching through the installed packages.

```bash
$ adb shell "pm list packages" | grep hello
package:com.example.helloandroid

$ adb shell "pm path com.example.helloandroid"
package:/data/app/com.example.helloandroid-1/base.apk

$ adb pull /data/app/com.example.helloandroid-1/base.apk
/data/app/com.example.helloandroid-1/base.a...pulled. 49.5 MB/s (3255374 bytes in 0.063s)
```

Using `apktool` we can decompile the application into smali code. Smali code is a less-than-readable version of the decompiled code. If we need further analysis we may need to decompile the code into a more human-readable format but for now it should suffice.

```bash
$ apktool d base.apk

I: Using Apktool 2.6.0 on base.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /home/user/.local/share/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Baksmaling classes.dex...
I: Baksmaling classes3.dex...
I: Baksmaling classes2.dex...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...
```

This is what the decompiled application looks like: We're free to view and modify anything that we want from here on. Let's try to look for and replace the "Hello World" message.

```bash
drwxrwxr-x   3 user user 4096 Nov 28 21:12 original
drwxrwxr-x 151 user user 4096 Nov 28 21:12 res
drwxrwxr-x   5 user user 4096 Nov 28 21:12 smali
drwxrwxr-x   4 user user 4096 Nov 28 21:12 smali_classes2
drwxrwxr-x   3 user user 4096 Nov 28 21:12 smali_classes3
-rw-rw-r--   1 user user  959 Nov 28 21:12 AndroidManifest.xml
-rw-rw-r--   1 user user 2174 Nov 28 21:12 apktool.yml
```

First we need to find where the message is stored. Since the message is in plain text, we can simply attempt to search the string in any of the files.

```bash
$ find . -type f -exec Pasted image 20211128213339echo "'{}'" \; | xargs egrep -i --color=auto "hello world"

./res/layout/activity_main.xml:    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Hello World!" app:layout_constraintBottom_toBottomOf="parent" app:layout_constraintLeft_toLeftOf="parent" app:layout_constraintRight_toRightOf="parent" app:layout_constraintTop_toTopOf="parent" />
```

We now know that the string can be found in the `activity_main.xml` file. We open that and modify it from `Hello World!` to `Hello w0lfram1te!`.

![](_media/001-android-modifying-file.png)

## Rebuilding the APK

Okay, we've successfully modified the decompiled code. Now the goal is to recompile everything and place it back into the Android testing device. Similarly, we use `apktool` to recompile the application.

```bash
$ apktool b base/ -o rebuild.apk

I: Using Apktool 2.6.0
I: Checking whether sources has changed...
I: Smaling smali folder into classes.dex...
I: Checking whether sources has changed...
I: Smaling smali_classes3 folder into classes3.dex...
I: Checking whether sources has changed...
I: Smaling smali_classes2 folder into classes2.dex...
I: Checking whether resources has changed...
I: Building resources...
I: Building apk file...
I: Copying unknown files/dir...
I: Built apk...
```

After recompiling, we need to sign the apk. We use `keytool` to generate the keystore and `apksigner` to sign the apk with the keystore.

```bash
$ keytool -genkey -v -keystore app.keystore -alias base -keyalg RSA -keysize 2048 -validity 10000 -storepass REDACTED

What is your first and last name?
  [Unknown]:  
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
	for: CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
[Storing app.keystore]
```

```bash
$ apksigner sign --ks app.keystore --ks-pass pass:REDACTED rebuild.apk
```

Now we can finally install the recompiled APK to our test device using `adb`. Note that you may have to uninstall the previous version of the APK for this to work.

```bash
$ adb install rebuild.apk

Performing Streamed Install
Success
```

Checking the application we can see that we were successful in modifying the plain text. 

![](_media/001-hello-w0lfram1te.png)