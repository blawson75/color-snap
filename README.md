# Color Snap

A cross-platform mobile app (Android + iOS) built with **React Native + Expo** that uses the camera to let you:
- **Snapshot** — pause the live camera feed to inspect an image.
- **Zoom & Pan** — pinch to zoom and drag to reposition.
- **Tap to sample** — touch any area; a circle highlights it and the app displays the color name in the corner.
- **Choose a language** — display the color name in your preferred language.
- **Close** — return to the live camera view.
- **Save** — save the zoomed image (with the circle and color label) to your photo library.

## Features

- Live camera preview with a **Snapshot** button.
- Snapshot screen with **pinch-zoom**, **pan**, and **tap-to-sample**.
- A circle overlay marks the sampled point.
- A color-name label in the corner, in the chosen language.
- Multi-language color naming (English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Korean).
- Save the annotated image to the device gallery.
- Camera / photo-library permission handling.

## Running

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your Android/iOS device, or run `npx expo start --web` for the web preview.

## Project layout

```
src/
  navigation/        # Root navigator
  screens/
    CameraScreen.tsx     # live camera + snapshot
    SnapshotScreen.tsx   # zoom/pan/tap + circle + color
    LanguagePicker.tsx   # language selection
  services/
    colorService.ts      # RGB -> color name (multi-language)
  utils/
    colorNames.ts        # language color vocabularies
  components/
    ColorLabel.tsx       # corner color display
```

## Permissions

Camera and photo-library permissions are requested at runtime via `expo-camera` and `expo-media-library`.