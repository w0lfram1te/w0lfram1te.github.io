---
title: Using the Apple Watch as a Soundboard
date_created: 2025-06-15
date_updated: 2025-06-15
metadata: howto
---
# Using the Apple Watch as a Soundboard

I initially got a smartwatch to have automation and scripting available without the need for a phone in my hand - partially due to the hassle of and the risk with whipping out my phone on my  commute. 

As a way to justify the existence of my smartwatch beyond being a glorified alarm clock, I looked for a way to use it as a soundboard. I needed the implementation to have the following requirements:

- **Must be done natively**. I'm trying to avoid bloat and installing a dedicated app for a bit doesn't make too much sense to me.
- **Must be available on-demand**. This means that it should be available offline and with as little delay as possible from initiation.

After months of having the Apple Watch with the above requirements in mind, I finally got around to doing it with the help of Shortcuts.

## tl;dr steps

This solution is the best among the two approaches that I tried - less lead time from the activation of the Shortcut, doesn't require an active internet connection, and shouldn't need a phone nearby.

1. Grab the `.mp3` file you want to play and base64 encode it. Take note of the output string. Sample audio file was taken from [file-examples.com](https://file-examples.com/index.php/sample-audio-files/sample-mp3-download/).

	```bash
$ cat file_example_MP3_700KB.mp3 | base64
	```

	![](_media/003-01.png)

2. Create the Shortcut.
	1. add the `Text` block, placing the base64 encoded string of the sound clip
	2. add the `Decode with base64` block, taking the previous `Text` as input 
	3. feed the decoded output to the `Play Sound` block
	![](_media/003-02.png)
	
**deploying on the apple watch**

To make the shortcut available on the Apple Watch, make sure to tick the `Show on Apple Watch` checkbox on the Shortcut Info screen.

## alternative approach w/caveats

There was a previous iteration that was somewhat successful. It doesnt require as much terminal-fu but it did have a significant delay (sometimes as bad as 10 seconds) and requires internet connectivity.  Given that the use of a soundboard is well-timed audio cues this kind of defeats the purpose. 

Just in case that instant playback isn't a requirement or if working on the terminal is a bit intimidating then this approach may be more appropriate.

1. Save the `.mp3` file in any iCloud folder. 

2. Create the Shortcut.
	1. add the `File` function and link the uploaded file
	2. add the `Play sound` which should use the previous block as its input

![](_media/003-03.png)
