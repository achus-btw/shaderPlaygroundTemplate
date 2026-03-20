cmake_minimum_required(VERSION 3.10)
project(MyOpenGLProject)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Add GLAD
add_library(glad glad/src/glad.c)
target_include_directories(glad PUBLIC glad/include)

# ImGui configuration
set(IMGUI_DIR ${CMAKE_CURRENT_SOURCE_DIR}/imgui)
set(IMGUI_SOURCES
    ${IMGUI_DIR}/imgui.cpp
    ${IMGUI_DIR}/imgui_demo.cpp
    ${IMGUI_DIR}/imgui_draw.cpp
    ${IMGUI_DIR}/imgui_tables.cpp
    ${IMGUI_DIR}/imgui_widgets.cpp
    ${IMGUI_DIR}/backends/imgui_impl_glfw.cpp
    ${IMGUI_DIR}/backends/imgui_impl_opengl3.cpp
)

# Find GLFW
find_package(glfw3 REQUIRED)

# Create executable
add_executable(main main.cpp ${IMGUI_SOURCES})

# Link libraries
target_link_libraries(main glad glfw GL)

# Include directories for main executable
target_include_directories(main PRIVATE
    glad/include
    ${IMGUI_DIR}
    ${IMGUI_DIR}/backends
)
