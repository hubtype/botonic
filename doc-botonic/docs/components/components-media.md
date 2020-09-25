---
id: media
title: Media
---

## Purpose

Using media such as images, videos, audios or attached files helps to visualize the conversation and draws attention.

<details>
<summary>Example</summary>

<img src="https://botonic-doc-static.netlify.com/images/media_files.png" width="200"/>
<img src="https://botonic-doc-static.netlify.com/images/media_files2.png" width="200"/>

</details>

## Audio Properties

The Audio component is used to make the conversation more dynamic and draw attention with the help of an audio element.

| Property | Type          | Description                            | Required | Default value |
|----------|---------------|----------------------------------------|----------|---------------|
| children | String        | Show audio object                      | No       |               |
| src      | URL or Object | Defines the type of audio files (mpeg) | Yes      | -             |


## Image Properties

The Image component is used to display different types of images, including network images, static resources, temporary local images, and images from local disk, such as the camera roll.

| Property | Type   | Description                | Required         | Default value |
|----------|--------|----------------------------|------------------|---------------|
| children | String | Show image object          | No               |               |
| src      | URL    | Defines the type of images | Yes  (PNG files) | -             |



## Example

You can send all these types of media files:

```javascript
<>
  <Image src='https://botonic.io/images/botonic_react_logo-p-500.png' />
  <Video src='https://www.w3schools.com/html/mov_bbb.mp4' />
  <Audio src='https://www.w3schools.com/html/horse.mp3' />
  <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf' />
</>
```
