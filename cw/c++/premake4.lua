-- A solution contains projects, and defines the available configurations
solution "MyApplication"
   location "prj"
   configurations { "Debug", "Release" }
 
   -- A project defines one build target
   project "MyApplication"
      location "prj"
      kind "ConsoleApp"
      language "C++"
      buildoptions {"-std=c++14"}
      files { "**.h", "**.cpp", "**.hpp" }
 
      configuration "Debug"
         targetdir "bin/debug"
         defines { "DEBUG" }
         flags { "Symbols" }
 
      configuration "Release"
         targetdir "bin/release"
         defines { "NDEBUG" }
         flags { "Optimize" }    