### Linux Download

If you're running **Arch** Linux, you can download the latest release from the [AUR](https://aur.archlinux.org/packages/astrosound-redux-git).

Otherwise, you can follow the instructions below, or download the precompiled application [here](https://github.com/XNBlank/astrosound-redux/releases/tag/0.0.5-3)

---

## How to build from source

If you want to build from the source:
- You'll first need to install [node.js](https://nodejs.org/en/).
- Clone the repo and open your console in the root folder of the clone, and run `npm install`.
- Then in the same console run `npm install electron-packager --save-dev`.
- Finally, run `electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]` (Refer to [Electron-Packager](https://github.com/electron-userland/electron-packager) for help.)
- A folder should be generated with your compiled application.
