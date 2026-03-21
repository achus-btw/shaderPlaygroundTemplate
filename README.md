# a basic planet shader for wallpaper
---
> this is a c++ base fullscreen shader using opengl.<br>
> it uses glsl to emulate the rendering of a planet without any geometry
---
## current state of the project
![current state](progress/3.png)


## How to Use:
>to comile and run the code `cmake -B build . && cmake --build build && ./build/main` <br>
>any edits made to the `shader.frag` can be hot reloaded from the terminal by pressing `r`

## todo:
>implement Rayleigh scattering<br>
>add proper biome logic<br>
>and phong lighting for the water<br>
>move the values to a seperate file to dynamically set planet params
