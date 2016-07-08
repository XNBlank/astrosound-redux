# AstroSound Redux
## AstroSound is getting an overhaul!

**What is AstroSound REDUX?**

AstroSound is my dream music player. It's something that I want to be easy to use, stylish and appealing to the eye, and fully functional. AstroSound REDUX is based around Google's Material Design. With the REDUX, I've decided to start from the ground up, and redesign the entire application to make it cleaner, and less bug ridden. 

![AstroSound](http://i.imgur.com/idmXRRE.png)

![AstroSound](http://i.imgur.com/n2bxXpH.gif)

## AstroSound is in public testing!

You can download the newest release from the [website](http://astrosound.xnblank.net/), or the [release tab](https://github.com/XNBlank/astrosound-redux/releases).

**Arch Linux** users can download it from the [AUR](https://aur.archlinux.org/packages/astrosound-redux-git)

## How to build from source

If you want to build from the source:
- You'll first need to install [node.js](https://nodejs.org/en/).
- Clone the repo and open your console in the root folder of the clone, and run `npm install`.
- Then in the same console run `npm install electron-packager --save-dev`.
- Finally, run `electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]` (Refer to [Electron-Packager](https://github.com/electron-userland/electron-packager) for help.)
- A folder should be generated with your compiled application.
